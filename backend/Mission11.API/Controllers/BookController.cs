using Microsoft.AspNetCore.Mvc;
using Mission11_Skyles.API.Data;

namespace Mission11_Skyles.API.Controllers;

[Route("[controller]")]
[ApiController]

public class BookController : Controller
{
    private BookstoreDbContext _bookContext;
    
    public BookController(BookstoreDbContext context) =>_bookContext = context;
    
    [HttpGet("AllBooks")]
    public IEnumerable<Book> GetBooks([FromQuery] List<string>? bookCategories = null)
    {
        var query = _bookContext.Books.AsQueryable();

        if (bookCategories != null && bookCategories.Any())
        {
            query = query.Where(b => bookCategories.Contains(b.Category));
        }

        return query.ToList();
    }

    [HttpGet("GetBookCategories")]
    public IActionResult GetBookCategories()
    {
        var bookCategories = _bookContext.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();
        
        return Ok(bookCategories);
    }
}

