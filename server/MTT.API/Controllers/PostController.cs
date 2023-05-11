using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly IPostService _postService;

    public PostController(
        IPostService postService)
    {
        _postService = postService;
    }
    
    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Post>> RetrievePostByIdAsync(Guid id)
    {
        var result = await _postService.RetrieveByIdAsync(id);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }
    
    [HttpGet]
    [AllowAnonymous]
    [Route("{offset}/{limit}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Post>> RetrievePostsAsync(int offset, int limit)
    {
        throw new NotImplementedException();
        var result = await _postService.RetrieveAsync(offset, limit);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Post>> AddPost([FromBody] Post post)
    {
        var result = await _postService.AddAsync(post);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }

    [HttpPut]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Post>> UpdatePostAsync([FromBody] Post post)
    {
        var result = await _postService.UpdateAsync(post);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }
    
    [HttpDelete]
    [Authorize]
    [Route("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult DeletePost(Guid id)
    {
        var result = _postService.Delete(id);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? result.Data);
    }
}