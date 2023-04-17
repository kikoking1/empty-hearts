using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface IUserService
{
    Task<ResultType<UserLogin>> RetrieveByUsernameAsync(string username);
    Task<ResultType<UserDto>> AddAsync(UserLogin user);
    Task<ResultType<string>> LoginAsync(UserLogin userLogin);
}