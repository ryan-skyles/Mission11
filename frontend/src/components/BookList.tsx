import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeBook, type Book } from "../types/Book";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { BookstoreResumeState } from "../types/BookstoreResume";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

function BookList({
  selectedCategories,
  initialPage,
  initialPageSize,
}: {
  selectedCategories: string[];
  initialPage?: number;
  initialPageSize?: number;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState(initialPageSize ?? 5);
  const [currentPage, setCurrentPage] = useState(initialPage ?? 1);
  const [titleSortAsc, setTitleSortAsc] = useState(true);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const prevCategoriesRef = useRef<string[] | null>(null);
  useEffect(() => {
    if (prevCategoriesRef.current === null) {
      prevCategoriesRef.current = selectedCategories;
      return;
    }
    const a = prevCategoriesRef.current;
    const b = selectedCategories;
    const changed =
      a.length !== b.length || a.some((c, i) => c !== b[i]);
    if (changed) {
      setCurrentPage(1);
    }
    prevCategoriesRef.current = b;
  }, [selectedCategories]);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join("&");

      const response = await fetch(
        `https://localhost:5000/Book/AllBooks${
          selectedCategories.length ? `?${categoryParams}` : ""
        }`
      );
      const data: unknown[] = await response.json();
      setBooks(data.map(normalizeBook));
    };
    fetchBooks();
  }, [selectedCategories]);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    copy.sort((a, b) => {
      const cmp = a.title.localeCompare(b.title, undefined, {
        sensitivity: "base",
      });
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

  const handleAddToCart = (book: Book) => {
    const resume: BookstoreResumeState = {
      categories: [...selectedCategories],
      page: currentPage,
      pageSize,
    };
    addToCart(book);
    navigate("/cart", { state: { resume } });
  };

  const cartLineCount = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity, 0),
    [cart]
  );
  const cartGrandTotal = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity * c.price, 0),
    [cart]
  );

  return (
    <div>
      <div className="card mb-4 border-primary border-opacity-25 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center g-3">
            <div className="col-md-8">
              <h2 className="h5 mb-1">Cart summary</h2>
              <p className="mb-0 text-muted small">
                {cartLineCount === 0
                  ? "Your cart is empty."
                  : `${cartLineCount} item${
                      cartLineCount === 1 ? "" : "s"
                    } in cart`}
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <p className="mb-2 mb-md-1">
                <span className="text-muted small d-block d-md-inline me-md-2">
                  Estimated total
                </span>
                <span className="fs-5 fw-semibold">
                  ${cartGrandTotal.toFixed(2)}
                </span>
              </p>
              <Link to="/cart" className="btn btn-sm btn-primary">
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <label htmlFor="pageSize" className="form-label mb-1 small text-muted">
            Books per page
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm"
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
        <div className="col-sm-6 col-md-auto">
          <label className="form-label mb-1 small text-muted d-block invisible d-sm-none">
            &nbsp;
          </label>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm w-100 w-sm-auto"
            onClick={() => setTitleSortAsc((v) => !v)}
          >
            Sort: {titleSortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
        {pageBooks.map((b) => (
          <div className="col" key={b.bookId}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="mb-2">
                  <span className="badge text-bg-secondary text-wrap">
                    {b.category}
                  </span>
                </div>
                <h3 className="card-title h6 flex-grow-0">{b.title}</h3>
                <p className="small text-muted mb-2">{b.author}</p>
                <p className="fs-5 fw-bold text-primary mb-3">
                  ${Number(b.price).toFixed(2)}
                </p>
                <ul className="list-unstyled small text-muted mb-3 flex-grow-1">
                  <li>{b.publisher}</li>
                  <li>ISBN {b.isbn}</li>
                  <li>{b.pageCount} pages</li>
                </ul>
                <button
                  type="button"
                  className="btn btn-success mt-auto"
                  onClick={() => handleAddToCart(b)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav aria-label="Book pagination">
        <ul className="pagination pagination-sm justify-content-center flex-wrap mb-0">
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
          <li
            className={`page-item ${
              currentPage >= totalPages ? "disabled" : ""
            }`}
          >
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
