import { Book } from "../models/bookModel";

const books: Book[] = [
    {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        isBorrowed: false,
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        isBorrowed: false,
    },
    {
        id: "3",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        isBorrowed: false,
    },
];

/**
 * Get all books, optionally filtered by title, author, or genre
 */
export const getAllBooks = (): Book[] => {
    return structuredClone(books);
};

/**
 * Helper: get a book by ID
 * Returns the book if found, otherwise null
 */
export const getBookById = (id: string): Book | null => {
    if (!id.trim()) return null;
    return books.find((b) => b.id === id) || null;
};

/**
 * Adds a new book to the library system.
 */
export const addBook = (
    bookData: Omit<Book, "id" | "isBorrowed" | "borrowerId" | "dueDate">
): Book => {
    if (!bookData.title || !bookData.author || !bookData.genre) {
        throw new Error(
            "Missing required fields: title, author, and genre are required"
        );
    }

    const newBook: Book = {
        id: (Math.random() * 10000).toFixed(0),
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        isBorrowed: false,
    };

    books.push(newBook);
    return newBook;
};

/**
 * Updates an existing book's information.
 */
export const updateBook = (
    id: string,
    bookData: Partial<Book>
): Book | null => {
    const book = books.find((b) => b.id === id);
    if (!book) return null;

    const safeUpdate = { ...bookData };
    delete safeUpdate.id;
    delete safeUpdate.isBorrowed;
    delete safeUpdate.borrowerId;
    delete safeUpdate.dueDate;

    Object.assign(book, safeUpdate);
    return structuredClone(book);
};

/**
 * Removes a book from the library system.
 */
export const deleteBook = (id: string): boolean => {
    const index = books.findIndex((b) => b.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        return true;
    }
    return false;
};

/**
 * Marks a book as borrowed by a user and sets a due date 14 days from now.
 * Returns null if book doesn't exist or is already borrowed
 */
export const borrowBook = (id: string, borrowerId: string): Book | null => {
    const book = getBookById(id);

    if (!book) return null;
    if (book.isBorrowed) return null;

    book.isBorrowed = true;
    book.borrowerId = borrowerId.trim();
    book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    return structuredClone(book);
};

/**
 * Marks a book as returned, removing borrower information and due date.
 * Returns null if book doesn't exist or is not currently borrowed
 */
export const returnBook = (id: string): Book | null => {
    const book = getBookById(id);
    if (!book) return null;
    if (!book.isBorrowed) return null;

    book.isBorrowed = false;
    delete book.borrowerId;
    delete book.dueDate;

    return structuredClone(book);
};

/**
 * Gets a list of recommended books from the library.
 */
export const getRecommendations = (): Book[] => {
    return structuredClone(books.slice(0, 3));
};
