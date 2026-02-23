import { Router } from "express";
import { bookController } from "src/modules/controllers";
import { validateRequest } from "src/middlewares/validate.middleware";
import { bookQuerySchema } from "src/validations/book.schema";

export const bookRouter = Router();

bookRouter.get(
  "/",
  validateRequest({ query: bookQuerySchema }),
  bookController.getBooks,
);
