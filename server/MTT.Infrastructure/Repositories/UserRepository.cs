using Microsoft.EntityFrameworkCore;
using MTT.Core.Interfaces;
using MTT.Core.Models;
using MTT.Infrastructure.DbContexts;

namespace MTT.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    
    private readonly MTTDbContext _mttDbContext;
    
    public UserRepository(MTTDbContext mttDbContext)
    {
        _mttDbContext = mttDbContext;
    }
    
    public async Task<User?> RetrieveByUsernameAsync(string username)
    {
        return await _mttDbContext.Users
            .FirstOrDefaultAsync(entity => entity.Username == username);
    }
    
    public async Task AddAsync(User user)
    {
        await _mttDbContext.AddAsync(user);
        await _mttDbContext.SaveChangesAsync();
    }
}