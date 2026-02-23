import { bookService } from "src/modules/services";
import logger from "src/utils/logger";
import { bookResponseSchema } from "src/validations/book.schema";

export const bookController = {};

bookController.getBooks = async (req, res, next) => {
  try {
    // Input validation is now handled by validateRequest middleware
    const result = await bookService.getBooks(req.query);

    // Normalize result to extract data array
    const rawData = Array.isArray(result) ? result : result.data;
    const meta = Array.isArray(result) ? null : result.meta;

    // Output Validation
    const outputValidation = bookResponseSchema.safeParse(rawData);
    if (!outputValidation.success) {
      logger.error(
        "API Contract Violation: Database data does not match output schema",
        {
          error: outputValidation.error.format(),
          ip: req.ip,
        },
      );
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    const validatedData = outputValidation.data;

    logger.info("Books retrieved successfully", {
      count: validatedData.length,
    });

    return res.status(200).json({
      success: true,
      data: validatedData,
      ...(meta && { meta }),
    });
  } catch (err) {
    logger.error("Failed to fetch books from database", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};
