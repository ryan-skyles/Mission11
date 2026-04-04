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

    [HttpPost("Add")]
    public IActionResult AddBook([FromBody]Book newBook)
    {
        _bookContext.Books.Add(newBook);
        _bookContext.SaveChanges();
        return Ok(newBook);

    }

    [HttpPut("UpdatedBook/{BookID}")]
    public IActionResult UpdateBook(int BookID, [FromBody] Book updatedBook)
    {
        var existingBook = _bookContext.Books.Find(BookID);
        if (existingBook == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;
        
        _bookContext.Books.Update(existingBook);
        _bookContext.SaveChanges();

        return Ok(existingBook);
    }

    [HttpDelete("DeleteBook/{BookID}")]
    public IActionResult DeleteBook(int BookID)
    {
        var book = _bookContext.Books.Find(BookID);

        if (book == null)
        {
            return NotFound(new {message = "Book not found"});
        }

        _bookContext.Books.Remove(book);
        _bookContext.SaveChanges();

        return NoContent();
    }
}

