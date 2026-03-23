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
    public IEnumerable<Book> GetBooks()
    {
        var books = _bookContext.Books.ToList();
        return books;
    }
    
}