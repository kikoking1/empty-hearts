using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MTT.Core.Configuration;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.Application.Services;

public class TokenService : ITokenService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AuthSettings _authSettings;
    
    public TokenService(IHttpContextAccessor httpContextAccessor,
        IOptions<AuthSettings> authSettings)
    {
        _httpContextAccessor = httpContextAccessor;
        _authSettings = authSettings.Value;
    }

    public ResultType<Guid> GetSessionUserId()
    {
        if(_httpContextAccessor.HttpContext == null)
        {
            return new ResultType<Guid>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "User is not logged in."
            };
        }

        var userIdStr = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrWhiteSpace(userIdStr))
        {
            return new ResultType<Guid>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "User is not logged in."
            };
        }

        var userId = Guid.Parse(userIdStr);

        return new ResultType<Guid>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = userId
        };
    }
    
    public string CreateToken(User user)
    {
        List<Claim> claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            // new Claim(ClaimTypes.Role, "Admin"),
            new Claim(ClaimTypes.Role, "User"),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authSettings.JwtSigningKey));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }
}