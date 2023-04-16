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

    public async Task<Post?> RetrieveByIdAsync(Guid? id)
    {
        return await _mttDbContext.Posts
            .FirstOrDefaultAsync(entity => entity.Id == id);
    }
    
    public async Task<List<Post>> RetrieveAsync()
    {
        return await _mttDbContext.Posts.ToListAsync();
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