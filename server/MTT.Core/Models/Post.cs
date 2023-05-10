namespace MTT.Core.Models;

public class Post
{
    public Guid? Id { get; set; }
    public string Body { get; set; }
    public string? Citation { get; set; }
    public Guid? UserId { get; set; }
    public int LikeCount { get; set; }
    public bool LikedByUser { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}