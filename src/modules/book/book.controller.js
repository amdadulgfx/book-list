import { bookService } from 'src/modules/services';

export const bookController = {};

bookController.getBooks = async (req, res, next) => {
    try {
        const books = await bookService.getBooks();
        res.status(200).json({ data: books, message: 'Successfully fetched book list!' });
    } catch (err) {
        next(err);
    }
};
