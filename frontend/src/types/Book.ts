// Client-side book shape (camelCase). Matches API after normalizeBook().
export interface Book {
    bookId: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

/** API returns `bookID` (from C# `BookID`); normalize to `bookId` for the app. */
export function normalizeBook(raw: unknown): Book {
    const r = raw as Record<string, unknown>;
    const id = r.bookId ?? r.bookID;
    return {
        bookId: Number(id),
        title: String(r.title ?? ""),
        author: String(r.author ?? ""),
        publisher: String(r.publisher ?? ""),
        isbn: String(r.isbn ?? ""),
        classification: String(r.classification ?? ""),
        category: String(r.category ?? ""),
        pageCount: Number(r.pageCount ?? 0),
        price: Number(r.price ?? 0),
    };
}