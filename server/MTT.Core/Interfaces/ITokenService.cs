using MTT.Core.Models;

namespace MTT.Core.Interfaces;

public interface ITokenService
{
    ResultType<Guid> GetSessionUserId();
    string CreateAccessToken(User user);
    string CreateRefreshToken(User user);
    Task<ResultType<LoginTokens>> RefreshLoginTokensAsync(string refreshToken);
}