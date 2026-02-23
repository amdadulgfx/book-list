import { bookService } from "src/modules/services";
import logger from "src/utils/logger";

export const bookController = {};

bookController.getBooks = async (req, res, next) => {
  try {
    const result = await bookService.getBooks(req.query);

    // If service returned raw array (no options), normalize to previous response shape
    if (Array.isArray(result)) {
      logger.info("Books retrieved successfully", { count: result.length });
      return res.status(200).json({ success: true, data: result });
    }

    const { data, meta } = result;
    logger.info("Books retrieved successfully", { count: data.length });
    return res.status(200).json({ success: true, data, meta });
  } catch (err) {
    if (err.statusCode === 400) {
      logger.warn("Invalid input for fetching books", {
        error: err.message,
        query: req.query,
        ip: req.ip,
      });
    } else {
      logger.error("Failed to fetch books from database", {
        error: err.message,
        stack: err.stack,
      });
    }
    next(err);
  }
};
