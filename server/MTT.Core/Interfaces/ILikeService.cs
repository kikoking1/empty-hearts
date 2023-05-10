using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface ILikeService
{
    Task<ResultType<Like>> AddLikeAsync(Guid postId);
    Task<ResultType<object>> DeleteLikeAsync(Guid likeId);
    
}