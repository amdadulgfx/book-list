import logger from "src/utils/logger";

/**
 * Reusable Express middleware for Zod validation
 * @param {Object} schemas - Object containing Zod schemas for body, query, and params
 */
export const validateRequest = (schemas) => {
  return async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      // Intercept Zod errors
      if (error.name === "ZodError" || error.errors) {
        const formattedError = error.format ? error.format() : error.errors;

        logger.warn("Request validation failed", {
          endpoint: req.originalUrl,
          method: req.method,
          ip: req.ip,
          errors: formattedError,
        });

        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: formattedError,
        });
      }

      // Pass other errors to the next middleware
      next(error);
    }
  };
};
