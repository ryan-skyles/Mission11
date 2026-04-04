// Admin add/edit book form; page count and price are strings while typing, parsed on submit.
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import type { Book } from "../types/Book";
import { addBook, updateBook } from "../api/BooksAPI";

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  /** When set, form updates this book instead of adding a new one. */
  editBook?: Book | null;
}

/** Strings for numeric fields so the user can clear the input and type freely. */
type BookFormValues = Omit<Book, "pageCount" | "price"> & {
  pageCount: string;
  price: string;
};

const emptyBook = (): BookFormValues => ({
  bookId: 0,
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  classification: "",
  category: "",
  pageCount: "",
  price: "",
});

function toPayload(form: BookFormValues): Book {
  const pageCount = parseInt(form.pageCount, 10);
  const price = parseFloat(form.price);
  return {
    ...form,
    pageCount: Number.isFinite(pageCount) ? pageCount : 0,
    price: Number.isFinite(price) ? price : 0,
  };
}

const NewBookForm = ({ onSuccess, onCancel, editBook }: NewBookFormProps) => {
  const [formData, setFormData] = useState<BookFormValues>(emptyBook);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (editBook) {
      setFormData({
        ...editBook,
        pageCount:
          editBook.pageCount === 0 ? "" : String(editBook.pageCount),
        price: editBook.price === 0 ? "" : String(editBook.price),
      });
    } else {
      setFormData(emptyBook());
    }
  }, [editBook]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (name === "pageCount" || name === "price") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const pageCount = parseInt(formData.pageCount, 10);
    const price = parseFloat(formData.price);
    if (formData.pageCount.trim() === "" || Number.isNaN(pageCount) || pageCount < 0) {
      setSubmitError("Enter a valid page count (0 or greater).");
      return;
    }
    if (formData.price.trim() === "" || Number.isNaN(price) || price < 0) {
      setSubmitError("Enter a valid price (0 or greater).");
      return;
    }

    const payload = toPayload(formData);

    try {
      if (editBook) {
        await updateBook(editBook.bookId, payload);
      } else {
        await addBook(payload);
      }
      onSuccess();
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  const isEdit = Boolean(editBook);

  return (
    <form onSubmit={handleSubmit} className="card card-body border shadow-sm">
      <h2 className="h5 mb-3">{isEdit ? "Edit book" : "Add a new book"}</h2>
      {submitError ? (
        <div className="alert alert-danger py-2" role="alert">
          {submitError}
        </div>
      ) : null}
      {isEdit ? (
        <div className="mb-2">
          <label className="form-label small text-muted">ID</label>
          <input
            className="form-control"
            type="number"
            value={formData.bookId}
            readOnly
            disabled
          />
        </div>
      ) : null}
      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Author</label>
          <input
            className="form-control"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Publisher</label>
          <input
            className="form-control"
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">ISBN</label>
          <input
            className="form-control"
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Classification</label>
          <input
            className="form-control"
            type="text"
            name="classification"
            value={formData.classification}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Page count</label>
          <input
            className="form-control"
            type="number"
            name="pageCount"
            min={0}
            inputMode="numeric"
            value={formData.pageCount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            name="price"
            step="0.01"
            min={0}
            inputMode="decimal"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Save changes" : "Add book"}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewBookForm;
