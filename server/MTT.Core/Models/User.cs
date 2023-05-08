namespace MTT.Core.Models;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}