using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
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

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> RegisterAsync(UserLogin userLogin)
    {
        var result = await _userService.RegisterAsync(userLogin);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<string>> LoginAsync(UserLogin userLogin)
    {
        var result = await _userService.LoginAsync(userLogin);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }

    
}