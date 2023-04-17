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
    private readonly Fixture _fixture;

    public PostServiceTests()
    {
        _fixture = new Fixture();
        _postRepositoryMock = new Mock<IPostRepository>();
        _sut = new PostService(_postRepositoryMock.Object);
    }
    
    [Fact]
    public async Task RetrievePostByIdAsync_Should_Return_Status404NotFound_When_NotFound()
    {
        var id = _fixture.Create<Guid>();
        Post? post = null;

        _postRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<Guid>()))
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
                It.IsAny<Guid>()))
            .ReturnsAsync(post);
        
        var result = await _sut.RetrieveByIdAsync(It.IsAny<Guid>());

        result.Data.Should().NotBe(null);
        result.Data?.Body.Should().Be(post.Body);
        result.ErrorMessage.Should().Be(null);
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task RetrieveAsync_Should_Return_Status200OK()
    {
        var posts = _fixture.Create<List<Post>>();

        _postRepositoryMock
            .Setup(mock => mock.RetrieveAsync())
            .ReturnsAsync(posts);
        
        var result = await _sut.RetrieveAsync();

        result.Data.Should().NotBeEmpty();
        result.Data?.Count.Should().Be(posts.Count);
        result.ErrorMessage.Should().Be(null);
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
    public async Task AddAsync_Should_Return_Status200OK_When_Post_Body_Is_Filled()
    {
        var post = _fixture.Build<Post>()
            .With(x => x.Body, _fixture.Create<string>())
            .Create();

        var result = await _sut.AddAsync(post);

        result.Data.Should().NotBeNull();
        result.Data?.Body.Should().Be(post.Body);
        result.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status400BadRequest_When_Post_Id_Is_null()
    {
        var post = _fixture.Build<Post>()
            .With(x => x.Id, null as Guid?)
            .Create();

        var result = await _sut.AddAsync(post);

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
                It.IsAny<Guid>()))
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
                It.IsAny<Guid>()))
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