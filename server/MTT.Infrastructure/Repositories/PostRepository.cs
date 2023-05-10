using Microsoft.EntityFrameworkCore;
using MTT.Core.Interfaces;
using MTT.Core.Models;
using MTT.Infrastructure.DbContexts;

namespace MTT.Infrastructure.Repositories;

public class PostRepository : IPostRepository
{
    private readonly MTTDbContext _mttDbContext;
    
    public PostRepository(MTTDbContext mttDbContext)
    {
        _mttDbContext = mttDbContext;
    }

    public async Task<Post?> RetrieveByIdAsync(Guid id, Guid userId)
    {
        return await _mttDbContext.Posts
            .Where(post => post.Id == id)
            .GroupJoin(
                _mttDbContext.Likes,
                post => post.Id,
                like => like.PostId,
                (post, likes) => new { Post = post, LikesCount = likes.Count(), LikedByUser = likes.Any(l => l.UserId == userId) })
            .Select(pl => new Post
            {
                Id = pl.Post.Id,
                UserId = pl.Post.UserId,
                Body = pl.Post.Body,
                DateCreated = pl.Post.DateCreated,
                DateModified = pl.Post.DateModified,
                LikeCount = pl.LikesCount,
                LikedByUser = pl.LikedByUser
            })
            .FirstOrDefaultAsync();
    }
    
    public async Task<List<Post>> RetrieveAsync(int offset, int limit, Guid userId)
    {
        return await _mttDbContext.Posts
            .OrderByDescending(b => b.Id)
            .Skip(offset)
            .Take(limit)
            .GroupJoin(
                _mttDbContext.Likes,
                post => post.Id,
                like => like.PostId,
                (post, likes) => new { Post = post, LikesCount = likes.Count(), LikedByUser = likes.Any(l => l.UserId == userId) })
            .Select(pl => new Post
            {
                Id = pl.Post.Id,
                UserId = pl.Post.UserId,
                Body = pl.Post.Body,
                DateCreated = pl.Post.DateCreated,
                DateModified = pl.Post.DateModified,
                LikeCount = pl.LikesCount,
                LikedByUser = pl.LikedByUser
            })
            .ToListAsync();
    }
    
    public async Task AddAsync(Post post)
    {
        post.Id = Guid.NewGuid();
        post.DateCreated = DateTime.UtcNow;
        post.DateModified = DateTime.UtcNow;

        await _mttDbContext.AddAsync(post);
        await _mttDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Post post)
    {
        post.DateModified = DateTime.UtcNow;

        _mttDbContext.Update(post);
        await _mttDbContext.SaveChangesAsync();
    }
    
    public void Delete(Guid id)
    {
        _mttDbContext.Remove(_mttDbContext.Posts.Single(a => a.Id == id));
        _mttDbContext.SaveChanges();
    }
}