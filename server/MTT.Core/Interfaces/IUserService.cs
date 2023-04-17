using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface IUserService
{
    Task<ResultType<UserDto>> RegisterAsync(UserLogin user);
    Task<ResultType<string>> LoginAsync(UserLogin userLogin);
}