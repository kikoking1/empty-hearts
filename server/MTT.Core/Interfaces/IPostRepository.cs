using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface IPostRepository
{
    Task<Post?> RetrieveByIdAsync(Guid? id);
    Task<List<Post>> RetrieveAsync(int offset, int limit);
    Task AddAsync(Post post);
    Task UpdateAsync(Post post);
    void Delete(Guid id);
}