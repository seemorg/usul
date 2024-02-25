import { json, text, varchar } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { book } from ".";
import { relations } from "drizzle-orm";
import type { Block } from "@openiti/markdown-parser";

export const version = createTable("version", {
  id: varchar("id", { length: 500 }).primaryKey(),
  bookId: text("author_id").notNull(),
  blocks: json("blocks").$type<Block[]>().default([]).notNull(),
  metadata: json("metadata")
    .$type<Record<string, string>>()
    .default({})
    .notNull(),
});

export const versionRelations = relations(version, ({ one }) => ({
  book: one(book, {
    fields: [version.bookId],
    references: [book.id],
  }),
}));
