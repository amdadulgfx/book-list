import { z } from "zod";

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  genre: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  publishedYear: z.coerce.number().int().optional(),
});

export const bookSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    published_year: z.number().int().optional(),
    rating: z.number().min(0).max(5),
  })
  .transform((data) => ({
    id: data.id,
    title: data.title,
    author: data.author,
    genre: data.genre,
    publishedYear: data.published_year,
    rating: data.rating,
  }));

export const bookResponseSchema = z.array(bookSchema);
