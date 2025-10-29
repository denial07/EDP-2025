namespace EDP.Api.Services
{
    public interface IJwtTokenService
    {
        string CreateToken(string userId, string email, string role);
    }
}
