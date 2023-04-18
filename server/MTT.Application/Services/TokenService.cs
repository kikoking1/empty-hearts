using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.Application.Services;

public class TokenService : ITokenService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public TokenService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
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
            return new ResultType<Guid>()
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
}