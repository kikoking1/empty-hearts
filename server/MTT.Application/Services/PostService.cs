using Microsoft.AspNetCore.Http;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.Application.Services;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;
    private readonly ITokenService _tokenService;

    public PostService(
        IPostRepository postRepository,
        ITokenService tokenService)
    {
        _postRepository = postRepository;
        _tokenService = tokenService;
    }

    public async Task<ResultType<Post>> RetrieveByIdAsync(Guid id)
    {
        var post = await _postRepository.RetrieveByIdAsync(id);
        
        if (post == null)
        {
            return new ResultType<Post>
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = $"Post with id: {id} does not exist",
            };
        }
        
        return new ResultType<Post>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = post
        };
    }    
    
    public async Task<ResultType<List<Post>>> RetrieveAsync(int offset, int limit)
    {
        if (limit > 100 || limit < 1 || offset < 0)
        {
            return new ResultType<List<Post>>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "Invalid limit or offset. Limit cannot be greater than 100, or less than 1. Offset cannot be less than 0."
            };
        }

        return new ResultType<List<Post>>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = await _postRepository.RetrieveAsync(offset, limit)
        };
    }
    
    public async Task<ResultType<Post>> AddAsync(Post post)
    {
        if (post.Body == String.Empty)
        {
            return new ResultType<Post>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "Post body cannot be empty",
            };
        }
        
        var userIdResult = _tokenService.GetSessionUserId();
        if (userIdResult.ErrorMessage != null)
        {
            return new ResultType<Post>
            {
                StatusCode = userIdResult.StatusCode,
                ErrorMessage = userIdResult.ErrorMessage,
            };
        }
        
        var userId = userIdResult.Data;
        post.UserId = userId;
        
        await _postRepository.AddAsync(post);
        
        return new ResultType<Post>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = post
        };
    }
    
    public async Task<ResultType<Post>> UpdateAsync(Post post)
    {
        if (post.Id == null)
        {
            return new ResultType<Post>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "Post id cannot be null",
            };
        }
        
        var existingPost = await _postRepository.RetrieveByIdAsync(post.Id);

        if (existingPost == null)
        {
            return new ResultType<Post>
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = $"No post with id: {post.Id} exists",
            };
        }
        
        await _postRepository.UpdateAsync(post);

        return new ResultType<Post>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = post,
        };
    }
    
    public ResultType<object> Delete(Guid id)
    {
        _postRepository.Delete(id);
        
        return new ResultType<object>
        {
            StatusCode = StatusCodes.Status200OK,
        };
    }
}