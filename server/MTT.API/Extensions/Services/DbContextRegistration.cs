using System.Reflection;
using Microsoft.EntityFrameworkCore;
using MTT.Infrastructure.DbContexts;

namespace MTT.API.Extensions.Services;

public static class DbContextRegistration
{
    public static void AddDbContexts(this IServiceCollection collection, ConfigurationManager config)
    {
        var sqliteConnectionString = config.GetSection("SqliteConnection")["ConnectionString"];

        collection.AddDbContext<MTTDbContext>(options =>
            options.UseSqlite(sqliteConnectionString, option =>
            {
                option.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
            })
        );
    }
}