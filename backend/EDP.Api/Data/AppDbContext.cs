using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EDP.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<TotpMfa> TotpMfas => Set<TotpMfa>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);
        b.Entity<TotpMfa>().ToTable("UserMfaTotp");
        b.Entity<TotpMfa>().HasKey(x => x.UserId);
    }
}
