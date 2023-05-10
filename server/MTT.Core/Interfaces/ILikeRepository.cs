using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface ILikeRepository
{
    Task AddAsync(Like like);
    Task<Like?> RetrieveByLikeIdAndUserIdAsync(Guid id, Guid userId);
    Task DeleteAsync(Like like);
}