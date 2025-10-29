using Microsoft.AspNetCore.Identity;

namespace EDP.Api.Data
{
    public class AppUser : IdentityUser
    {
        // optional custom fields
        public string? DisplayName { get; set; }
    }
}
