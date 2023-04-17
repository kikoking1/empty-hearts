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
    
    // [HttpGet, Authorize]
    // public ActionResult<string> GetMyName()
    // {
    //     return Ok(_userService.GetMyName());

    //var userName = User?.Identity?.Name;
    //var roleClaims = User?.FindAll(ClaimTypes.Role);
    //var roles = roleClaims?.Select(c => c.Value).ToList();
    //var roles2 = User?.Claims
    //    .Where(c => c.Type == ClaimTypes.Role)
    //    .Select(c => c.Value)
    //    .ToList();
    //return Ok(new { userName, roles, roles2 });
    // }
    
    public ResultType<Guid> GetSessionUserId()
    {
        if(_httpContextAccessor.HttpContext == null)
        {
            return new ResultType<Guid>
            {
                StatusCode = StatusCodes.Status200OK,
                ErrorMessage = "User is not logged in."
            };
        }

        var userIdStr = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrWhiteSpace(userIdStr))
        {
            return new ResultType<Guid>()
            {
                StatusCode = StatusCodes.Status200OK,
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