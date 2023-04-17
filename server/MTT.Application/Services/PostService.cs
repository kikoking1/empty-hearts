using Microsoft.AspNetCore.Http;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.Application.Services;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;

    public PostService(IPostRepository postRepository)
    {
        _postRepository = postRepository;
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
    
    public async Task<ResultType<List<Post>>> RetrieveAsync()
    {
        return new ResultType<List<Post>>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = await _postRepository.RetrieveAsync()
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