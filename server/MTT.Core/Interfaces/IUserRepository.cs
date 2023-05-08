using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid userId);
    Task<User?> RetrieveByUsernameAsync(string username);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
}