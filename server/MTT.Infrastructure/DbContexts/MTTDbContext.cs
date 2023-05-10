using Microsoft.EntityFrameworkCore;
using MTT.Core.Models;

namespace MTT.Infrastructure.DbContexts;

public class MTTDbContext : DbContext
{
    public MTTDbContext(DbContextOptions<MTTDbContext> options)
        : base(options)
    {
    }
    
    public virtual DbSet<Post> Posts { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Like> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>().ToTable("Posts")
            .Ignore(c => c.LikedByUser)
            .Ignore(c => c.LikeCount);
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<Like>().ToTable("Likes");

        
        base.OnModelCreating(modelBuilder);
    }
}