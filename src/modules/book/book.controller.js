import { bookService } from 'src/modules/services';

export const bookController = {};

bookController.getBooks = async (req, res, next) => {
  try {
    const result = await bookService.getBooks(req.query);

    // If service returned raw array (no options), normalize to previous response shape
    if (Array.isArray(result)) {
      return res.status(200).json({ success: true, data: result });
    }

    const { data, meta } = result;
    return res.status(200).json({ success: true, data, meta });
  } catch (err) {
    next(err);
  }
};
