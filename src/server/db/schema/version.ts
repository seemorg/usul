import { text, varchar } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { book } from ".";
import { relations } from "drizzle-orm";

export const version = createTable("version", {
  id: varchar("id", { length: 500 }).primaryKey(),
  bookId: text("author_id").notNull(),
  content: text("content").notNull(),
});

export const versionRelations = relations(version, ({ one }) => ({
  book: one(book, {
    fields: [version.bookId],
    references: [book.id],
  }),
}));
