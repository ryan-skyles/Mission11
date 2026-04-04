using Microsoft.EntityFrameworkCore;

namespace Mission11_Skyles.API.Data;

// EF Core database session; connection string comes from appsettings (Bookstore.sqlite by default).
public class BookstoreDbContext : DbContext
{
    public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options) : base(options)
    {
    }
    
    public DbSet<Book> Books { get; set; }
}