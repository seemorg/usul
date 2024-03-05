import { text, varchar, uniqueIndex } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { relations } from "drizzle-orm";
import { locationsToAuthors } from ".";

export const location = createTable(
  "location",
  {
    id: varchar("id", { length: 300 }).primaryKey(), // author specific slug
    slug: varchar("slug", { length: 500 }).notNull(), // general slug
    name: text("name").notNull(),
    type: varchar("type", { length: 100 }).notNull(), // visited, resided, born, died
    regionCode: text("region_code"),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex("slug_index").on(table.slug, table.type),
    };
  },
);

export const locationRelations = relations(location, ({ many }) => ({
  authors: many(locationsToAuthors),
}));
