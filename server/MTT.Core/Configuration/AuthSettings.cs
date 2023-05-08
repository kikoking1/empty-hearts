namespace MTT.Core.Configuration;

public class AuthSettings
{
    public string JwtSigningKey { get; set; }
    public string JwtRefreshTokenSigningKey { get; set; }
}