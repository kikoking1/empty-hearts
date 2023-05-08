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
    private readonly IUserRepository _userRepository;
    
    public TokenService(IHttpContextAccessor httpContextAccessor,
        IOptions<AuthSettings> authSettings,
        IUserRepository userRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _authSettings = authSettings.Value;
        _userRepository = userRepository;
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
    
    public string CreateAccessToken(User user)
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
    
    public string CreateRefreshToken(User user)
    {
        List<Claim> claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            // new Claim(ClaimTypes.Role, "Admin"),
            new Claim(ClaimTypes.Role, "User"),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authSettings.JwtRefreshTokenSigningKey));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

    public async Task<ResultType<LoginTokens>> RefreshLoginTokensAsync(string refreshToken)
    {
        const string errorMessage = "User is not logged in.";

        var (isValid, userId) = ValidateRefreshToken(refreshToken);
        
        if (!isValid || userId == null)
        {
            return new ResultType<LoginTokens>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = errorMessage
            };
        }
        
        var existingUser = await _userRepository.GetByIdAsync(userId.Value);
        
        if (existingUser == null)
        {
            return new ResultType<LoginTokens>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = errorMessage
            };
        }

        return new ResultType<LoginTokens>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = new LoginTokens
            {
                AccessToken = CreateAccessToken(existingUser),
                RefreshToken = CreateRefreshToken(existingUser)
            }
        };
    }

    private (bool isValid, Guid? userId) ValidateRefreshToken(string refreshToken)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateAudience = false,
            ValidateIssuer = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authSettings.JwtRefreshTokenSigningKey))
        };
        
        var claim = new JwtSecurityTokenHandler().ValidateToken(refreshToken, tokenValidationParameters, out _);

        if (claim == null)
        {
            return (false, null);
        }
        
        var userIdStr = claim.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrWhiteSpace(userIdStr))
        {
            return (false, null);
        }

        //check if userId is valid guid
        if (!Guid.TryParse(userIdStr, out var userId))
        {
            return (false, null);
        }
        
        return (true, userId);
    }
}