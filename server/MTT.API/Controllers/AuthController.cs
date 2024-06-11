using Microsoft.AspNetCore.Mvc;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly SameSiteMode _sameSiteMode;

    public AuthController(IUserService userService, ITokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
        _sameSiteMode =
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production"
                ? SameSiteMode.Strict
                : SameSiteMode.None;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> RegisterAsync(UserLogin userLogin)
    {
        var result = await _userService.RegisterAsync(userLogin);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object)result.Data);
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<string>> LoginAsync(UserLogin userLogin)
    {
        var result = await _userService.LoginAsync(userLogin);

        if (result.ErrorMessage == null && result.Data != null)
        {
            Response.Cookies.Append(
                "X-Refresh-Token",
                result.Data.RefreshToken,
                new CookieOptions()
                {
                    HttpOnly = true,
                    SameSite = _sameSiteMode,
                    Secure = true
                }
            );
        }

        return StatusCode(
            result.StatusCode,
            result.ErrorMessage ?? (object)result.Data?.AccessToken
        );
    }

    [HttpGet("refresh")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<string>> RefreshTokenAsync()
    {
        if (!Request.Cookies.TryGetValue("X-Refresh-Token", out var refreshToken))
            return BadRequest();

        var result = await _tokenService.RefreshLoginTokensAsync(refreshToken);

        if (result.ErrorMessage == null && result.Data != null)
        {
            Response.Cookies.Append(
                "X-Refresh-Token",
                result.Data.RefreshToken,
                new CookieOptions()
                {
                    HttpOnly = true,
                    SameSite = _sameSiteMode,
                    Secure = true
                }
            );
        }

        return StatusCode(
            result.StatusCode,
            result.ErrorMessage ?? (object)result.Data?.AccessToken
        );
    }

    [HttpGet("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<string> Logout()
    {
        Response.Cookies.Append(
            "X-Refresh-Token",
            "",
            new CookieOptions()
            {
                Expires = DateTime.Now.AddDays(-1),
                HttpOnly = true,
                SameSite = _sameSiteMode,
                Secure = true
            }
        );
        return StatusCode(StatusCodes.Status200OK);
    }
}

