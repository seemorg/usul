import { primaryKey, varchar } from "drizzle-orm/mysql-core";
import { createTable } from "./utils";
import { relations } from "drizzle-orm";
import { author, location } from ".";

export const locationsToAuthors = createTable(
  "locations_to_authors",
  {
    locationId: varchar("location_id", { length: 300 }).notNull(),
    authorId: varchar("author_id", { length: 300 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.locationId, t.authorId] }),
  }),
);
export const locationsToAuthorsRelations = relations(
  locationsToAuthors,
  ({ one }) => ({
    location: one(location, {
      fields: [locationsToAuthors.locationId],
      references: [location.id],
    }),
    author: one(author, {
      fields: [locationsToAuthors.authorId],
      references: [author.id],
    }),
  }),
);
