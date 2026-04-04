// Fetches books for selected categories, sorts/paginates, cart summary, and add-to-cart navigation.
import { useEffect, useMemo, useRef, useState } from "react";
import type { Book } from "../types/Book";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { BookstoreResumeState } from "../types/BookstoreResume";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from "./Pagination";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBooks(selectedCategories);
        setBooks(data.books);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
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

  if (loading) {
    return <p>Loading Books...</p>;
  }

  if (error) {
    return (
      <p className="text-danger" role="alert">
        Error: {error}
      </p>
    );
  }

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={setCurrentPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setCurrentPage(1);
        }}
        titleSortAsc={titleSortAsc}
        onToggleSort={() => setTitleSortAsc((v) => !v)}
      />

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

    </div>
  );
}

export default BookList;
