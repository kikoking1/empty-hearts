using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using MTT.Application.Services;
using MTT.Core.Interfaces;
using MTT.Core.Models;
using Xunit;

namespace MTT.Tests;

public class PostServiceTests
{
    private readonly IPostService _sut;
    private readonly Mock<IPostRepository> _postRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Fixture _fixture;

    public PostServiceTests()
    {
        _fixture = new Fixture();
        _postRepositoryMock = new Mock<IPostRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        
        _sut = new PostService(_postRepositoryMock.Object, _tokenServiceMock.Object);
    }
    
    [Fact]
    public async Task RetrievePostByIdAsync_Should_Return_Status404NotFound_When_NotFound()
    {
        var id = _fixture.Create<Guid>();
        Post? post = null;

        _postRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(post);
        
        var result = await _sut.RetrieveByIdAsync(id);

        result.Data.Should().Be(null);
        result.ErrorMessage.Should().Be($"Post with id: {id} does not exist");
        result.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }
    
    [Fact]
    public async Task RetrievePostByIdAsync_Should_Return_Status200OK_When_Found()
    {
        var post = _fixture.Create<Post>();

        _postRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(post);
        
        var result = await _sut.RetrieveByIdAsync(It.IsAny<Guid>());

        result.Data.Should().NotBe(null);
        result.Data?.Body.Should().Be(post.Body);
        result.ErrorMessage.Should().Be(null);
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Theory]
    [InlineData(-1, 100)]
    [InlineData(0, 101)]
    [InlineData(10, 0)]
    [InlineData(10, -1)]
    public async Task RetrieveAsync_Should_Return_Status400BadRequest_When_Invalid_Limit_Offset_Parameters(int offset, int limit)
    {
        var result = await _sut.RetrieveAsync(offset, limit);

        result.Data.Should().BeNull();
        result.ErrorMessage.Should().Be("Invalid limit or offset. Limit cannot be greater than 100, or less than 1. Offset cannot be less than 0.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Theory]
    [InlineData(0, 100)]
    [InlineData(0, 10)]
    [InlineData(100, 1)]
    public async Task RetrieveAsync_Should_Return_Status200OK_When_Valid_Limit_Offset_Parameters(int offset, int limit)
    {
        var posts = _fixture.Create<List<Post>>();

        _postRepositoryMock
            .Setup(mock => mock.RetrieveAsync(offset, limit, It.IsAny<Guid>()))
            .ReturnsAsync(posts);
        
        var result = await _sut.RetrieveAsync(offset, limit);

        result.Data.Should().NotBeEmpty();
        result.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task AddAsync_Should_Return_Status400BadRequest_When_Post_Body_Is_Empty()
    {
        var post = _fixture.Build<Post>()
            .With(x => x.Body, String.Empty)
            .Create();

        var result = await _sut.AddAsync(post);

        result.Data.Should().BeNull();
        result.ErrorMessage.Should().Be("Post body cannot be empty");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }    
    
    [Fact]
    public async Task AddAsync_Should_Return_Status400BadRequest_When_GetSessionUserId_Fails_With_Status400BadRequest()
    {
        var post = _fixture.Build<Post>()
            .With(x => x.Body, _fixture.Create<string>())
            .Create();

        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<Guid>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = "User is not logged in."
            });

        var result = await _sut.AddAsync(post);

        result.Data.Should().BeNull();
        result.ErrorMessage.Should().Be("User is not logged in.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public async Task AddAsync_Should_Return_Status200OK_When_Post_Body_Is_Filled()
    {
        var post = _fixture.Build<Post>()
            .With(x => x.Body, _fixture.Create<string>())
            .Create();
        
        var userId = _fixture.Create<Guid>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<Guid>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });

        var result = await _sut.AddAsync(post);

        result.Data.Should().NotBeNull();
        result.Data?.Body.Should().Be(post.Body);
        result.Data?.UserId.Should().Be(userId);
        result.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status400BadRequest_When_Post_Id_Is_null()
    {
        var post = _fixture.Build<Post>()
            .With(x => x.Id, null as Guid?)
            .Create();

        var result = await _sut.UpdateAsync(post);

        result.Data.Should().BeNull();
        result.ErrorMessage.Should().Be("Post id cannot be null");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status404NotFound_When_Post_Not_Found()
    {
        var post = _fixture.Build<Post>().Create();
        
        _postRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(null as Post);
        
        var result = await _sut.UpdateAsync(post);

        result.Data.Should().BeNull();
        result.ErrorMessage.Should().Be($"No post with id: {post.Id} exists");
        result.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status200OK_When_Successful()
    {
        var post = _fixture.Build<Post>().Create();
        
        _postRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(post);
        
        var result = await _sut.UpdateAsync(post);

        result.Data.Should().NotBeNull();
        result.Data?.Id.Should().Be(post.Id);
        result.Data?.UserId.Should().Be(post.UserId);
        result.Data?.DateCreated.Should().Be(post.DateCreated);
        result.Data?.DateModified.Should().Be(post.DateModified);
        result.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public void Delete_Should_Return_Status200OK_When_Successful()
    {
        var result = _sut.Delete(It.IsAny<Guid>());

        result.Data.Should().BeNull();
        result.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
}