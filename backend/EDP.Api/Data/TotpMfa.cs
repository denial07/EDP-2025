using System;
using System.ComponentModel.DataAnnotations;

namespace EDP.Api.Data;

public class TotpMfa
{
    [Key] public string UserId { get; set; } = default!;
    public string SecretBase32 { get; set; } = default!;
    public bool IsEnabled { get; set; } = false;
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    public DateTime? LastVerifiedUtc { get; set; }
}
