import { useEffect, useMemo, useState } from "react";
import type { Book } from "./types/Book";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [titleSortAsc, setTitleSortAsc] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("https://localhost:5000/Book/AllBooks");
      const data = await response.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    copy.sort((a, b) => {
      const cmp = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      return titleSortAsc ? cmp : -cmp;
    });
    return copy;
  }, [books, titleSortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / pageSize));

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBooks.slice(start, start + pageSize);
  }, [sortedBooks, currentPage, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (n: number) => {
    setPageSize(n);
    setCurrentPage(1);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Bookstore</h1>

      <div className="row g-3 align-items-end mb-3">
        <div className="col-auto">
          <label htmlFor="pageSize" className="form-label mb-0">
            Books per page
          </label>
          <select
            id="pageSize"
            className="form-select"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setTitleSortAsc((v) => !v)}
          >
            Sort by title: {titleSortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
        {pageBooks.map((b) => (
          <div className="col" key={b.bookId}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title h5">{b.title}</h3>
                <ul className="list-unstyled mb-0 small">
                  <li>
                    <strong>Author:</strong> {b.author}
                  </li>
                  <li>
                    <strong>Publisher:</strong> {b.publisher}
                  </li>
                  <li>
                    <strong>ISBN:</strong> {b.isbn}
                  </li>
                  <li>
                    <strong>Classification:</strong> {b.classification}
                  </li>
                  <li>
                    <strong>Category:</strong> {b.category}
                  </li>
                  <li>
                    <strong>Pages:</strong> {b.pageCount}
                  </li>
                  <li>
                    <strong>Price:</strong> ${b.price}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav aria-label="Book pagination">
        <ul className="pagination justify-content-center flex-wrap">
          <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>
          <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookList;