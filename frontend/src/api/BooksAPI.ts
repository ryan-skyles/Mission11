// HTTP helpers for the ASP.NET Book API (list, categories, admin add/update/delete).
import type { Book } from "../types/Book";
import { normalizeBook } from "../types/Book";

export interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_ROOT =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    ""
  ) ?? "https://localhost:5000";

/** Base URL for Book controller routes, e.g. `https://host/Book`. */
export const BOOKS_API_URL = `${API_ROOT}/Book`;

function parseBooksPayload(raw: unknown): Book[] {
  if (Array.isArray(raw)) {
    return raw.map(normalizeBook);
  }
  const obj = raw as { books?: unknown[] };
  const list = obj.books ?? [];
  return list.map(normalizeBook);
}

export const fetchBooks = async (
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  const categoryParams = selectedCategories
    .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
    .join("&");

  const response = await fetch(
    `${BOOKS_API_URL}/AllBooks${
      selectedCategories.length ? `?${categoryParams}` : ""
    }`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  const raw: unknown = await response.json();
  const books = parseBooksPayload(raw);
  const totalNumBooks = Array.isArray(raw)
    ? raw.length
    : Number((raw as { totalNumBooks?: number }).totalNumBooks ?? books.length);
  return { books, totalNumBooks };
};

export const addBook = async (newBook: Book): Promise<Book> => {
  const response = await fetch(`${BOOKS_API_URL}/Add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newBook, bookId: 0 }),
  });
  if (!response.ok) {
    throw new Error("Failed to add book");
  }
  const data: unknown = await response.json();
  return normalizeBook(data);
};

export const updateBook = async (
  bookId: number,
  book: Book
): Promise<Book> => {
  const response = await fetch(`${BOOKS_API_URL}/UpdatedBook/${bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...book, bookId }),
  });
  if (!response.ok) {
    throw new Error("Failed to update book");
  }
  const data: unknown = await response.json();
  return normalizeBook(data);
};

export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${BOOKS_API_URL}/DeleteBook/${bookId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
};
