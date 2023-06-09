﻿using System.Security.Claims;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Moq;
using MTT.Application.Services;
using MTT.Core.Configuration;
using MTT.Core.Interfaces;
using MTT.Core.Models;
using Xunit;

namespace MTT.Tests;

public class TokenServiceTests
{
    private readonly ITokenService _sut;
    private readonly Fixture _fixture;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessor;
    private readonly Mock<IOptions<AuthSettings>> _authSettings;
    private readonly Mock<IUserRepository> _userRepository;

    public TokenServiceTests()
    {
        _fixture = new Fixture();
        _httpContextAccessor = new Mock<IHttpContextAccessor>();
        _authSettings = new Mock<IOptions<AuthSettings>>();
        _authSettings.SetupGet(x => x.Value).Returns(_fixture.Create<AuthSettings>());
        _userRepository = new Mock<IUserRepository>();

        _sut = new TokenService(_httpContextAccessor.Object, _authSettings.Object, _userRepository.Object);
    }
    
    [Fact]
    public void GetSessionUserId_Should_Return_Status400BadRequest_When_User_Not_Logged_In()
    {
        _httpContextAccessor.Setup(x => x.HttpContext)
            .Returns(null as DefaultHttpContext);

        var result = _sut.GetSessionUserId();

        result.Data.Should().BeEmpty();
        result.ErrorMessage.Should().Be("User is not logged in.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public void GetSessionUserId_Should_Return_Status400BadRequest_When_User_NameIdentifier_Claim_Missing_From_Context()
    {
        var context = CreateMissingClaimDefaultHttpContext();
        _httpContextAccessor.Setup(x => x.HttpContext)
            .Returns(context);

        var result = _sut.GetSessionUserId();

        result.Data.Should().BeEmpty();
        result.ErrorMessage.Should().Be("User is not logged in.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public void GetSessionUserId_Should_Return_Status200OK_When_Successfully_Retrieves_User_Id_From_HttpContext()
    {
        var context = CreateExpectedDefaultHttpContext();
        _httpContextAccessor.Setup(x => x.HttpContext)
            .Returns(context);

        var result = _sut.GetSessionUserId();

        result.Data.Should().NotBeEmpty();
        result.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public void CreateAccessToken_Should_Return_Access_Token_When_Successfully_Creates_Access_Token()
    {
        var user = _fixture.Create<User>();
        var result = _sut.CreateAccessToken(user);

        result.Should().NotBeEmpty();
    }
    
    private DefaultHttpContext CreateExpectedDefaultHttpContext()
    {
        var userIdString = _fixture.Create<Guid>().ToString(); 
        var context = new DefaultHttpContext();
        
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userIdString),
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.Role, "User")
        };
        
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        
        var principal = new ClaimsPrincipal(identity);
        
        context.User = principal;

        return context;
    }
    
    private DefaultHttpContext CreateMissingClaimDefaultHttpContext()
    {
        var context = new DefaultHttpContext();
        
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.Role, "User")
        };
        
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        
        var principal = new ClaimsPrincipal(identity);
        
        context.User = principal;

        return context;
    }
}