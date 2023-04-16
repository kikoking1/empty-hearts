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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>().ToTable("Posts", "test");
        
        base.OnModelCreating(modelBuilder);
    }
}