using Microsoft.EntityFrameworkCore;
using MTT.Core.Interfaces;
using MTT.Core.Models;
using MTT.Infrastructure.DbContexts;

namespace MTT.Infrastructure.Repositories;

public class LikeRepository : ILikeRepository
{
    private readonly MTTDbContext _mttDbContext;
    
    public LikeRepository(MTTDbContext mttDbContext)
    {
        _mttDbContext = mttDbContext;
    }

    public async Task<Like?> RetrieveByPostIdAndUserIdAsync(Guid postId, Guid userId)
    {
        return await _mttDbContext.Likes
            .FirstOrDefaultAsync(entity => entity.PostId == postId && entity.UserId == userId);
    }

    public async Task AddAsync(Like like)
    {
        like.Id = Guid.NewGuid();
        like.CreatedAt = DateTime.UtcNow;
        like.UpdatedAt = DateTime.UtcNow;

        await _mttDbContext.AddAsync(like);
        await _mttDbContext.SaveChangesAsync();
    }
    
    public async Task DeleteAsync(Like like)
    {
        _mttDbContext.Remove(like);
        await _mttDbContext.SaveChangesAsync();
    }
}