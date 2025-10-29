using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OtpNet;
using QRCoder;
using EDP.Api.Data;

namespace EDP.Api.Endpoints;

public static class MfaEndpoints
{
    private const string Issuer = "EDPApp"; // shows in Google Authenticator

    public static IEndpointRouteBuilder MapMfa(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/mfa/totp").RequireAuthorization();

        // 1) Enroll: create secret + QR
        group.MapPost("enroll", async ([FromServices] AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;

            // create or rotate secret
            var secretBytes = KeyGeneration.GenerateRandomKey(20);
            var base32 = Base32Encoding.ToString(secretBytes);

            var label = Uri.EscapeDataString($"{Issuer}:{userId}");
            var issuer = Uri.EscapeDataString(Issuer);
            var otpUri = $"otpauth://totp/{label}?secret={base32}&issuer={issuer}&digits=6&period=30&algorithm=SHA1";

            var mfa = await db.TotpMfas.FindAsync(userId);
            if (mfa is null)
            {
                mfa = new TotpMfa { UserId = userId, SecretBase32 = base32, IsEnabled = false };
                db.TotpMfas.Add(mfa);
            }
            else
            {
                mfa.SecretBase32 = base32;
                mfa.IsEnabled = false;
            }
            await db.SaveChangesAsync();

            // make QR as data URL
            using var gen = new QRCodeGenerator();
            using var data = gen.CreateQrCode(otpUri, QRCodeGenerator.ECCLevel.Q);
            using var qr = new PngByteQRCode(data);
            var png = qr.GetGraphic(10);
            var dataUrl = $"data:image/png;base64,{Convert.ToBase64String(png)}";

            return Results.Ok(new { base32, otpUri, qr = dataUrl });
        });

        // 2) Verify enrollment: user types first code → enable
        group.MapPost("verify", async ([FromServices] AppDbContext db, ClaimsPrincipal user, [FromBody] VerifyDto body) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var mfa = await db.TotpMfas.FirstOrDefaultAsync(x => x.UserId == userId);
            if (mfa is null) return Results.BadRequest("Not enrolled.");

            var totp = new Totp(Base32Encoding.ToBytes(mfa.SecretBase32), mode: OtpHashMode.Sha1, step: 30, totpSize: 6);
            var valid = totp.VerifyTotp(body.Code, out _, new VerificationWindow(previous: 1, future: 1));
            if (!valid) return Results.BadRequest("Invalid code.");

            mfa.IsEnabled = true;
            mfa.LastVerifiedUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok(new { enabled = true });
        });

        // 3) Challenge during login: verify code
        group.MapPost("challenge", async ([FromServices] AppDbContext db, ClaimsPrincipal user, [FromBody] VerifyDto body) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var mfa = await db.TotpMfas.FirstOrDefaultAsync(x => x.UserId == userId && x.IsEnabled);
            if (mfa is null) return Results.BadRequest("MFA not enabled.");

            var totp = new Totp(Base32Encoding.ToBytes(mfa.SecretBase32), mode: OtpHashMode.Sha1, step: 30, totpSize: 6);
            var valid = totp.VerifyTotp(body.Code, out _, new VerificationWindow(previous: 1, future: 1));
            return valid ? Results.Ok(new { passed = true }) : Results.BadRequest("Invalid code.");
        });

        return app;
    }

    public record VerifyDto(string Code);
}
