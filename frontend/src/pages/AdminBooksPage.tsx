// Admin: paginated table, add/edit via NewBookForm, delete with confirm; refetches after mutations.
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Book } from "../types/Book";
import { deleteBook, fetchBooks } from "../api/BooksAPI";
import Pagination from "../components/Pagination";
import NewBookForm from "../components/NewBookForm";
import Header from "../components/Header";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [titleSortAsc, setTitleSortAsc] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const reloadBooks = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchBooks([]);
      setBooks(data.books);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadBooks();
  }, [reloadBooks]);

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

  const closeForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const openAdd = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const openEdit = (b: Book) => {
    setEditingBook(b);
    setShowForm(true);
  };

  const handleDelete = async (b: Book) => {
    if (!window.confirm(`Delete “${b.title}”?`)) return;
    try {
      await deleteBook(b.bookId);
      await reloadBooks();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <div className="container py-4">
          <p>Loading books…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <h1 className="h3 mb-0">Admin — Books</h1>
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            Add book
          </button>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        {showForm ? (
          <div className="mb-4">
            <NewBookForm
              editBook={editingBook}
              onSuccess={async () => {
                closeForm();
                await reloadBooks();
              }}
              onCancel={closeForm}
            />
          </div>
        ) : null}

        <div className="mb-3">
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
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Page Count</th>
                <th className="text-end">Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pageBooks.map((b) => (
                <tr key={b.bookId}>
                  <td>{b.bookId}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{b.isbn}</td>
                  <td>{b.classification}</td>
                  <td>{b.category}</td>
                  <td>{b.pageCount}</td>
                  <td className="text-end">${Number(b.price).toFixed(2)}</td>
                  <td className="text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(b)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => void handleDelete(b)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminBooksPage;
