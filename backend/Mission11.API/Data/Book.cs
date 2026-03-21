namespace Mission11_Skyles.API.Data;
using System.ComponentModel.DataAnnotations;

public class Book
{
    [Key]
    [Required]
    public int BookID { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Author { get; set; }

    [Required]
    public string Publisher { get; set; }

    [Required]
    public string ISBN { get; set; }

    [Required]
    public string Classification { get; set; }

    [Required]
    public string Category { get; set; }

    [Required]
    public int PageCount { get; set; }

    [Required]
    public double Price { get; set; }
}