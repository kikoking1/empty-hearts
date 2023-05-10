using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface ILikeRepository
{
    Task AddAsync(Like like);
    Task<Like?> RetrieveByPostIdAndUserIdAsync(Guid postId, Guid userId);
    Task DeleteAsync(Like like);
}