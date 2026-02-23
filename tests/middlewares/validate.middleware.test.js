import { z } from "zod";
import { validateRequest } from "src/middlewares/validate.middleware";
import logger from "src/utils/logger";

// Mock the logger to prevent actual logging during tests
jest.mock("src/utils/logger", () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

describe("validateRequest Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      originalUrl: "/test",
      method: "GET",
      ip: "127.0.0.1",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  const dummySchema = {
    query: z.object({
      page: z.coerce.number().int().min(1),
    }),
  };

  test("Case 1 (Success): Should coerce type, reassign to req, and call next()", async () => {
    req.query = { page: "2" };

    const middleware = validateRequest(dummySchema);
    await middleware(req, res, next);

    expect(req.query.page).toBe(2); // Coerced to number
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Case 2 (Failure): Should return 400, call logger.warn, and NOT call next()", async () => {
    req.query = { page: "invalid" };

    const middleware = validateRequest(dummySchema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Validation Error",
      }),
    );
    expect(logger.warn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
