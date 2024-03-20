import { text, varchar, uniqueIndex } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { relations } from "drizzle-orm";
import { genresToBooks } from ".";

export const genre = createTable(
  "genre",
  {
    id: varchar("id", { length: 300 }).primaryKey(), // author specific slug
    slug: varchar("slug", { length: 500 }).notNull(), // general slug
    name: text("name").notNull(),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex("slug_index").on(table.slug),
    };
  },
);

export const genreRelations = relations(genre, ({ many }) => ({
  books: many(genresToBooks),
}));
