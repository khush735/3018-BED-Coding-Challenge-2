import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import * as bookService from "../services/bookService";

export const getAllBooks = (req: Request, res: Response): void => {
    try {
        const { title, author, genre } = req.query;

        const filters: { title?: string; author?: string; genre?: string } = {};
        if (typeof title === "string" && title.trim().length > 0) {
            filters.title = title.trim();
        }
        if (typeof author === "string" && author.trim().length > 0) {
            filters.author = author.trim();
        }
        if (typeof genre === "string" && genre.trim().length > 0) {
            filters.genre = genre.trim();
        }

        const books = bookService.getAllBooks(
            Object.keys(filters).length ? filters : undefined
        );

        res.status(HTTP_STATUS.OK).json({
            message: "Books retrieved",
            data: books,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving books",
        });
    }
};
export const addBook = (req: Request, res: Response): void => {
    try {
        const newBook = req.body;
        const createdBook = bookService.addBook(newBook);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Book added",
            data: createdBook,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error adding book",
        });
    }
};

export const updateBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedBook = bookService.updateBook(id, updatedData);
        if (updatedBook) {
            res.status(HTTP_STATUS.OK).json({
                message: "Book updated",
                data: updatedBook,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error updating book",
        });
    }
};

export const deleteBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const success = bookService.deleteBook(id);
        if (success) {
            res.status(HTTP_STATUS.OK).json({ message: "Book deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error deleting book",
        });
    }
};

export const borrowBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        // Validate id param
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Book ID parameter is required and cannot be empty",
            });
            return;
        }

        // Validate borrowerId in body
        const { borrowerId } = req.body as { borrowerId?: unknown };
        if (typeof borrowerId !== "string") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "borrowerId is required in request body and must be a non-empty string",
            });
            return;
        }
        const borrowerIdTrimmed = borrowerId.trim();
        if (borrowerIdTrimmed.length === 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "borrowerId cannot be empty or whitespace only",
            });
            return;
        }

        // Check existence
        const existing = bookService.getBookById(id);
        if (!existing) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
            return;
        }

        // Check if already borrowed
        if (existing.isBorrowed) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Book is already borrowed",
            });
            return;
        }

        // All validations passed — perform borrow
        const result = bookService.borrowBook(id, borrowerIdTrimmed);
        // result should be non-null since we already checked existence and borrow status
        res.status(HTTP_STATUS.OK).json({
            message: "Book borrowed",
            data: result,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error borrowing book",
        });
    }
};

export const returnBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const result = bookService.returnBook(id);
        if (result) {
            res.status(HTTP_STATUS.OK).json({ message: "Book returned" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found or not currently borrowed",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error returning book",
        });
    }
};

export const getRecommendations = (req: Request, res: Response): void => {
    try {
        const recommendations = bookService.getRecommendations();
        res.status(HTTP_STATUS.OK).json({
            message: "Recommendations retrieved",
            data: recommendations,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error fetching recommendations",
        });
    }
};