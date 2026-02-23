import { Router } from "express";
import { bookController } from "src/modules/controllers";
import { validateRequest } from "src/middlewares/validate.middleware";
import { bookQuerySchema } from "src/validations/book.schema";

export const bookRouter = Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 *     description: Fetches a list of books with support for searching, filtering, and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or author
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Filter by minimum rating
 *       - in: query
 *         name: publishedYear
 *         schema:
 *           type: integer
 *         description: Filter by published year
 *     responses:
 *       200:
 *         description: A list of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       genre:
 *                         type: string
 *                       publishedYear:
 *                         type: integer
 *                       rating:
 *                         type: number
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *       500:
 *         description: Internal Server Error
 */
bookRouter.get(
  "/",
  validateRequest({ query: bookQuerySchema }),
  bookController.getBooks,
);
