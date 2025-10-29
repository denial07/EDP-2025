using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using EDP.Api.Data;
using EDP.Api.Services;

namespace EDP.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuth(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        // --- Register ---
        group.MapPost("/register", async (
            [FromServices] UserManager<AppUser> userManager,
            [FromBody] RegisterRequest req) =>
        {
            var user = new AppUser
            {
                UserName = req.Email,
                Email = req.Email,
                DisplayName = req.DisplayName
            };

            var result = await userManager.CreateAsync(user, req.Password);
            return result.Succeeded
                ? Results.Ok(new { message = "Registered successfully" })
                : Results.BadRequest(result.Errors);
        });

        // --- Login ---
        group.MapPost("/login", async (
            [FromServices] UserManager<AppUser> userManager,
            [FromServices] IJwtTokenService jwtService,
            [FromBody] LoginRequest req) =>
        {
            var user = await userManager.FindByEmailAsync(req.Email);
            if (user == null) return Results.BadRequest("Invalid email or password");

            var valid = await userManager.CheckPasswordAsync(user, req.Password);
            if (!valid) return Results.BadRequest("Invalid email or password");

            // generate JWT
            var token = jwtService.CreateToken(user.Id, user.Email!, "User");
            return Results.Ok(new { token });
        });

        return app;
    }

    // --- DTOs ---
    public record RegisterRequest(string Email, string Password, string DisplayName);
    public record LoginRequest(string Email, string Password);
}
