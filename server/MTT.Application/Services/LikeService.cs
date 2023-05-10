using Microsoft.AspNetCore.Http;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.Application.Services;

public class LikeService : ILikeService
{
    private readonly ITokenService _tokenService;
    private readonly ILikeRepository _likeRepository;
    private readonly IPostRepository _postRepository;
    
    public LikeService(ITokenService tokenService,
        ILikeRepository likeRepository,
        IPostRepository postRepository)
    {
        _tokenService = tokenService;
        _likeRepository = likeRepository;
        _postRepository = postRepository;
    }

    public async Task<ResultType<Like>> AddLikeAsync(Guid postId)
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        if (sessionUserIdResult.ErrorMessage != null)
        {
            return new ResultType<Like>
            {
                StatusCode = sessionUserIdResult.StatusCode,
                ErrorMessage = sessionUserIdResult.ErrorMessage
            };
        }
        
        var userId = sessionUserIdResult.Data;

        var post = await _postRepository.RetrieveByIdAsync(postId, userId);

        if (post == null)
        {
            return new ResultType<Like>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "Post does not exist."
            };
        }

        var like = new Like
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId
        };

        await _likeRepository.AddAsync(like);

        return new ResultType<Like>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = like
        };
    }
    
    public async Task<ResultType<object>> DeleteLikeAsync(Guid likeId)
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        if (sessionUserIdResult.ErrorMessage != null)
        {
            return new ResultType<object>
            {
                StatusCode = sessionUserIdResult.StatusCode,
                ErrorMessage = sessionUserIdResult.ErrorMessage
            };
        }
        
        var userId = sessionUserIdResult.Data;

        var like = await _likeRepository.RetrieveByLikeIdAndUserIdAsync(likeId, userId);

        if (like == null)
        {
            return new ResultType<object>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "Like does not exist."
            };
        }

        await _likeRepository.DeleteAsync(like);

        return new ResultType<object>
        {
            StatusCode = StatusCodes.Status204NoContent
        };
    }
}