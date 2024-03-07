import { text, varchar, uniqueIndex } from 'drizzle-orm/mysql-core';
import { createTable } from './utils';
import { relations } from 'drizzle-orm';
import { location } from '.';

export const region = createTable(
  'region',
  {
    id: varchar('id', { length: 300 }).primaryKey(), // region specific slug
    slug: varchar('slug', { length: 500 }).notNull(), // general slug
    name: text('name'),
    currentName: text('current_name'),
    arabicName: text('arabic_name'),
    overview: text('overview'),
  },
  table => {
    return {
      slugIdx: uniqueIndex('slug_index').on(table.slug),
    };
  },
);

export const regionRelations = relations(region, ({ many }) => ({
  locations: many(location),
}));
