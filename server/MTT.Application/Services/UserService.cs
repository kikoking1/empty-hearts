using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MTT.Core.Configuration;
using MTT.Core.Interfaces;
using MTT.Core.Models;

namespace MTT.Application.Services;

public class UserService : IUserService
{
    private const string FailedLoginMessage = "Invalid username or password.";
    
    private readonly AuthSettings _authSettings;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    
    public UserService(IUserRepository userRepository,
        IOptions<AuthSettings> authSettings,
        IMapper mapper)
    {
        _authSettings = authSettings.Value;
        _mapper = mapper;
        _userRepository = userRepository;
    }

    public async Task<ResultType<UserDto>> RegisterAsync(UserLogin userLogin)
    {
        var existingUser = await _userRepository.RetrieveByUsernameAsync(userLogin.Username);
        
        if (existingUser != null)
        {
            return new ResultType<UserDto>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = $"User with username: {userLogin.Username} is not available.",
            };
        }

        var passwordHash
            = BCrypt.Net.BCrypt.HashPassword(userLogin.Password);
        
        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = userLogin.Username,
            PasswordHash = passwordHash,
            DateCreated = DateTime.UtcNow,
            DateModified = DateTime.UtcNow,
        };

        await _userRepository.AddAsync(newUser);
        
        var userDto = _mapper.Map<UserDto>(newUser);
        
        return new ResultType<UserDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = userDto
        };
    }

    public async Task<ResultType<string>> LoginAsync(UserLogin userLogin)
    {
        var existingUser = await _userRepository.RetrieveByUsernameAsync(userLogin.Username);
        
        if (existingUser == null)
        {
            return new ResultType<string>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = FailedLoginMessage,
            };
        }

        if (!BCrypt.Net.BCrypt.Verify(userLogin.Password, existingUser.PasswordHash))
        {
            return new ResultType<string>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = FailedLoginMessage,
            };
        }

        var token = CreateToken(existingUser);
        
        return new ResultType<string>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = token,
        };
    }
    
    private string CreateToken(User user)
    {
        List<Claim> claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(ClaimTypes.Role, "User"),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authSettings.JwtSigningKey));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }
}