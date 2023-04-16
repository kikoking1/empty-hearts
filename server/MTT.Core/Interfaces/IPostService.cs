using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface IPostService
{
    Task<ResultType<Post>> RetrieveByIdAsync(Guid id);
    Task<ResultType<List<Post>>> RetrieveAsync();
    Task<ResultType<Post>> AddAsync(Post post);
    Task<ResultType<Post>> UpdateAsync(Post post);
    ResultType<object> Delete(Guid id);
}