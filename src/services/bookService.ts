// bookApi.ts
// simple in-memory "library system"

import { Book } from "../models/bookModel"

// some starter books
const books: Book[] = [
  { id: "1", 
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald", 
    genre: "Fiction", 
    isBorrowed: false 
},
  
{ id: "2", 
    title: "1984", 
    author: "George Orwell", 
    genre: "Dystopian", 
    isBorrowed: false 
},
  
{ id: "3", 
    title: "To Kill a Mockingbird", 
    author: "Harper Lee", 
    genre: "Classic", 
    isBorrowed: false },
]

// get all books (with optional filters by title/author)
export const getAllBooks = (filters?: { title?: string; author?: string }): Book[] => {
  let result = books

  if (filters?.title) {
    const t = filters.title.toLowerCase()
    result = result.filter(b => b.title.toLowerCase().includes(t))
  }

  if (filters?.author) {
    const a = filters.author.toLowerCase()
    result = result.filter(b => b.author.toLowerCase().includes(a))
  }

  return [...result] // return copy
}

// find one book by id
export const getBookById = (id: string): Book | null => {
  const found = books.find(b => b.id === id)
  return found ? { ...found } : null
}

// add a new book (id auto-gen, starts as not borrowed)
export const addBook = (
  bookData: Omit<Book, "id" | "isBorrowed" | "borrowerId" | "dueDate">
): Book => {
  if (!bookData.title || !bookData.author || !bookData.genre) {
    throw new Error("title, author, and genre are required")
  }

  const newBook: Book = {
    id: (Math.random() * 10000).toFixed(0),
    title: bookData.title,
    author: bookData.author,
    genre: bookData.genre,
    isBorrowed: false,
  }

  books.push(newBook)
  return newBook
}

// update existing book info (id/borrow info not allowed here)
export const updateBook = (id: string, bookData: Partial<Book>): Book | null => {
  const book = books.find(b => b.id === id)
  if (!book) return null

  const safeUpdate = { ...bookData }
  delete safeUpdate.id
  delete safeUpdate.isBorrowed
  delete safeUpdate.borrowerId
  delete safeUpdate.dueDate

  Object.assign(book, safeUpdate)
  return { ...book }
}

// delete book by id
export const deleteBook = (id: string): boolean => {
  const index = books.findIndex(b => b.id === id)
  if (index === -1) return false
  books.splice(index, 1)
  return true
}

// borrow book (marks borrowed + sets due date in 14 days)
export const borrowBook = (id: string, borrowerId: string): Book | null => {
  const book = books.find(b => b.id === id)
  if (!book || book.isBorrowed) return null

  book.isBorrowed = true
  book.borrowerId = borrowerId
  book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

  return { ...book }
}

// return book (clears borrower info)
export const returnBook = (id: string): Book | null => {
  const book = books.find(b => b.id === id)
  if (!book || !book.isBorrowed) return null

  book.isBorrowed = false
  delete book.borrowerId
  delete book.dueDate

  return { ...book }
}

// quick "recommendations" (just first 3 books for now)
export const getRecommendations = (): Book[] => {
  return [...books.slice(0, 3)]
}
