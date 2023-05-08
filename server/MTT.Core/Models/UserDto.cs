namespace MTT.Core.Models;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string RefreshToken { get; set; }
}