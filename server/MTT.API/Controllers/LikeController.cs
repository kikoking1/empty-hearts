using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LikeController : ControllerBase
{
    private readonly ILikeService _likeService;
    public LikeController(ILikeService likeService)
    {
        _likeService = likeService;
    }

    [HttpPost]
    [Route("{postId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Like>> AddLikeAsync(Guid postId)
    {
        var result = await _likeService.AddLikeAsync(postId);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }
    
    [HttpDelete]
    [Route("{postId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeleteLikeAsync(Guid postId)
    {
        var result = await _likeService.DeleteLikeAsync(postId);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? result.Data);
    }
}