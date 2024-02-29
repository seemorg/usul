import { int, json, text, varchar, uniqueIndex } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { relations } from "drizzle-orm";
import { book } from ".";

export const author = createTable(
  "author",
  {
    id: varchar("id", { length: 300 }).primaryKey(), // author specific slug
    slug: varchar("slug", { length: 500 }).notNull(), // general slug
    primaryArabicName: text("primary_arabic_name"),
    otherArabicNames: json("other_arabic_names")
      .$type<string[]>()
      .default([])
      .notNull(),
    primaryLatinName: text("primary_latin_name"),
    otherLatinNames: json("other_latin_names")
      .$type<string[]>()
      .default([])
      .notNull(),
    year: int("year").notNull(), // year in hijri
    relatedGeographies: json("related_geographies")
      .$type<string[]>()
      .default([])
      .notNull(),
    numberOfBooks: int("number_of_books").default(0).notNull(),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex("slug_index").on(table.slug),
    };
  },
);

export const authorRelations = relations(author, ({ many }) => ({
  books: many(book),
}));
