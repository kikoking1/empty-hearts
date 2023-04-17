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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>().ToTable("Posts");
        modelBuilder.Entity<User>().ToTable("Users");
        
        base.OnModelCreating(modelBuilder);
    }
}