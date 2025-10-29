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
    private const string Issuer = "EDPApp";

    public static IEndpointRouteBuilder MapMfa(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/mfa/totp").RequireAuthorization();

        // 1️⃣ Enroll - generate secret and QR
        group.MapPost("/enroll", async ([FromServices] AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var secretBytes = KeyGeneration.GenerateRandomKey(20);
            var base32 = Base32Encoding.ToString(secretBytes);

            var label = Uri.EscapeDataString($"{Issuer}:{userId}");
            var uri = $"otpauth://totp/{label}?secret={base32}&issuer={Issuer}&digits=6&period=30";

            var mfa = await db.TotpMfas.FindAsync(userId);
            if (mfa == null)
            {
                mfa = new TotpMfa { UserId = userId, SecretBase32 = base32 };
                db.TotpMfas.Add(mfa);
            }
            else
            {
                mfa.SecretBase32 = base32;
                mfa.IsEnabled = false;
            }
            await db.SaveChangesAsync();

            // Generate QR image
            using var gen = new QRCodeGenerator();
            using var data = gen.CreateQrCode(uri, QRCodeGenerator.ECCLevel.Q);
            using var qr = new PngByteQRCode(data);
            var base64 = Convert.ToBase64String(qr.GetGraphic(10));

            return Results.Ok(new { secret = base32, qr = $"data:image/png;base64,{base64}" });
        });

        // 2️⃣ Verify - enable MFA
        group.MapPost("/verify", async ([FromServices] AppDbContext db, ClaimsPrincipal user, [FromBody] VerifyDto body) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var mfa = await db.TotpMfas.FirstOrDefaultAsync(x => x.UserId == userId);
            if (mfa == null) return Results.BadRequest("Not enrolled.");

            var totp = new Totp(Base32Encoding.ToBytes(mfa.SecretBase32));
            var valid = totp.VerifyTotp(body.Code, out _, new VerificationWindow(1, 1));

            if (!valid) return Results.BadRequest("Invalid code.");
            mfa.IsEnabled = true;
            await db.SaveChangesAsync();

            return Results.Ok(new { enabled = true });
        });

        return app;
    }

    public record VerifyDto(string Code);
}
