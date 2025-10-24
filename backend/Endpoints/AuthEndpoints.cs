using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using EDP.Api.Data;
using EDP.Api.Services;

namespace EDP.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuth(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/register", async (
            [FromBody] RegisterRequest req,
            UserManager<AppUser> userManager) =>
        {
            var user = new AppUser
            {
                UserName = req.Email,
                Email = req.Email
            };

            var result = await userManager.CreateAsync(user, req.Password);
            if (!result.Succeeded)
            {
                return Results.BadRequest(result.Errors.Select(e => e.Description));
            }

            return Results.Ok(new { message = "Registration successful" });
        });

        app.MapPost("/api/auth/login", async (
            [FromBody] LoginRequest req,
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IJwtTokenService jwt) =>
        {
            var user = await userManager.FindByEmailAsync(req.Email);
            if (user == null)
                return Results.Unauthorized();

            var result = await signInManager.CheckPasswordSignInAsync(user, req.Password, false);
            if (!result.Succeeded)
                return Results.Unauthorized();

            var token = await jwt.CreateTokenAsync(user);
            return Results.Ok(new
            {
                token,
                user = new { user.Id, user.Email }
            });
        });

        app.MapGet("/api/auth/me", [Authorize] async (
            UserManager<AppUser> userManager,
            HttpContext http) =>
        {
            var id = http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (id == null) return Results.Unauthorized();

            var user = await userManager.FindByIdAsync(id);
            if (user == null) return Results.NotFound();

            return Results.Ok(new { user.Id, user.Email });
        });
    }

    public record RegisterRequest([Required] string Email, [Required] string Password);
    public record LoginRequest([Required] string Email, [Required] string Password);
}
