using Microsoft.EntityFrameworkCore;

namespace Mission11_Skyles.API.Data;

public class BookstoreDbContext : DbContext
{
    public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options) : base(options)
    {
    }
    
    public DbSet<Book> Books { get; set; }
}