import { bookController } from "src/modules/book/book.controller";
import { bookService } from "src/modules/services";
import logger from "src/utils/logger";

// Mock the logger
jest.mock("src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Mock the bookService
jest.mock("src/modules/services", () => ({
  bookService: {
    getBooks: jest.fn(),
  },
}));

describe("Book Controller - getBooks", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      ip: "127.0.0.1",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("Successful Retrieval: Should return 200 and call logger.info", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "Mock Book",
        author: "Author",
        genre: "Genre",
        published_year: 2023,
        rating: 4.5,
      },
    ];

    // Force the mocked service to resolve
    bookService.getBooks.mockResolvedValue({
      data: mockBooks,
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });

    await bookController.getBooks(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            title: "Mock Book",
            publishedYear: 2023, // Check transform/validation logic
          }),
        ]),
      }),
    );
    expect(logger.info).toHaveBeenCalledWith(
      "Books retrieved successfully",
      expect.objectContaining({ count: 1 }),
    );
  });

  test("Database Failure Handling: Should call logger.error and next(error)", async () => {
    const error = new Error("Database connection timeout");
    bookService.getBooks.mockRejectedValue(error);

    await bookController.getBooks(req, res, next);

    expect(logger.error).toHaveBeenCalledWith(
      "Failed to fetch books from database",
      expect.objectContaining({
        error: error.message,
      }),
    );
    expect(next).toHaveBeenCalledWith(error);
  });
});
