using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface ITokenService
{
    ResultType<Guid> GetSessionUserId();
}