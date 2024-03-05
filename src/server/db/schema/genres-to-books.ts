import { primaryKey, varchar } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { relations } from "drizzle-orm";
import { book, genre } from ".";

export const genresToBooks = createTable(
  "genres_to_books",
  {
    genreId: varchar("genre_id", { length: 300 }).notNull(),
    bookId: varchar("book_id", { length: 300 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.genreId, t.bookId] }),
  }),
);
export const genresToBooksRelations = relations(genresToBooks, ({ one }) => ({
  genre: one(genre, {
    fields: [genresToBooks.genreId],
    references: [genre.id],
  }),
  book: one(book, {
    fields: [genresToBooks.bookId],
    references: [book.id],
  }),
}));
