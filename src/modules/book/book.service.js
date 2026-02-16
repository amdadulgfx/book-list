import booksData from '../../../books.json';
import { CustomError } from 'src/utils/error';

// Return raw array when no options are provided, otherwise apply query/filter/pagination
export const getBooks = async (options) => {
  const books = booksData || [];

  // If no options provided, keep previous behavior (return array)
  if (!options) return books;

  // clone array to avoid mutating original data
  let result = [...books];

  const {
    page: pageQuery,
    limit: limitQuery,
    search,
    genre,
    minRating: minRatingQuery,
    publishedYear: publishedYearQuery,
  } = options;

  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 50;

  const parsedPage = Number.isInteger(Number(pageQuery)) ? parseInt(pageQuery, 10) : DEFAULT_PAGE;
  const parsedLimit = Number.isInteger(Number(limitQuery)) ? parseInt(limitQuery, 10) : DEFAULT_LIMIT;

  const page = parsedPage;
  let limit = parsedLimit > MAX_LIMIT ? MAX_LIMIT : parsedLimit;

  if (page < 1) {
    throw new CustomError(400, 'Invalid "page" parameter. Must be >= 1.');
  }

  // SEARCH
  if (typeof search === 'string' && search.trim() !== '') {
    const lowered = search.toLowerCase();
    result = result.filter((b) => {
      const title = (b.title || '').toString().toLowerCase();
      const author = (b.author || '').toString().toLowerCase();
      return title.includes(lowered) || author.includes(lowered);
    });
  }

  // FILTERS
  if (typeof genre === 'string' && genre.trim() !== '') {
    const genreLower = genre.toLowerCase();
    result = result.filter((b) => (b.genre || '').toString().toLowerCase() === genreLower);
  }

  const minRating = parseFloat(minRatingQuery);
  if (!Number.isNaN(minRating)) {
    result = result.filter((b) => (typeof b.rating === 'number' ? b.rating >= minRating : true));
  }

  const publishedYear = Number.isInteger(Number(publishedYearQuery)) ? parseInt(publishedYearQuery, 10) : NaN;
  if (!Number.isNaN(publishedYear)) {
    result = result.filter((b) => (Number.isInteger(Number(b.published_year)) ? parseInt(b.published_year, 10) === publishedYear : false));
  }

  // PAGINATION
  const total = result.length;
  limit = Number.isInteger(Number(limit)) && limit > 0 ? limit : DEFAULT_LIMIT;
  const totalPages = Math.ceil(total / limit) || 0;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = result.slice(startIndex, endIndex);

  return {
    data: paginatedBooks,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
