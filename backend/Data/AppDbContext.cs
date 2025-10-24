using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EDP.Api.Data;

public class AppUser : IdentityUser
{
    // extra profile fields later: public string? FullName { get; set; }
    // Role will come from IdentityRole via UserRoles
}

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
