"use server";

import { cache } from "react";
import { db } from "../db";
import {
  author,
  book,
  genre,
  genresToBooks,
  location,
  locationsToAuthors,
} from "../db/schema";
import { and, count, countDistinct, desc, eq, gte, lt, sql } from "drizzle-orm";

export const findAllGenres = cache(async () => {
  return await db.query.genre.findMany();
});

export const findGenreBySlug = cache(async (slug: string) => {
  const genreRecord = await db.query.genre.findFirst({
    where: (genre, { eq }) => eq(genre.slug, slug),
  });

  if (!genreRecord) {
    return;
  }

  const results = await db
    .select({
      count: count(genresToBooks.bookId),
    })
    .from(genresToBooks)
    .where(eq(genresToBooks.genreId, genreRecord.id));

  return {
    genre: genreRecord,
    count: results[0]!.count,
  };
});

export const findAllGenresWithBooksCount = cache(
  async ({
    yearRange,
    authorId,
    regionCode,
  }: {
    yearRange?: [number, number];
    authorId?: string;
    regionCode?: string;
  } = {}) => {
    if (yearRange) {
      return await db
        .select({
          genreId: genre.id,
          booksCount: sql<number>`${countDistinct(book.id)} as booksCount`,
        })
        .from(book)
        .orderBy(desc(sql`booksCount`))
        .leftJoin(author, eq(author.id, book.authorId))
        .leftJoin(genresToBooks, eq(book.id, genresToBooks.bookId))
        .leftJoin(genre, eq(genresToBooks.genreId, genre.id))
        .where(
          and(gte(author.year, yearRange[0]), lt(author.year, yearRange[1])),
        )
        .groupBy(genre.id);
    }

    if (regionCode) {
      return (await db
        .select({
          genreId: genresToBooks.genreId,
          booksCount: sql<number>`${countDistinct(book.id)} as booksCount`,
        })
        .from(book)
        .orderBy(desc(sql`booksCount`))
        .leftJoin(genresToBooks, eq(book.id, genresToBooks.bookId))
        .leftJoin(
          locationsToAuthors,
          eq(book.authorId, locationsToAuthors.authorId),
        )
        .leftJoin(location, eq(locationsToAuthors.locationId, location.id))
        .where(eq(location.regionCode, regionCode))
        .groupBy(genresToBooks.genreId)) as {
        genreId: string;
        booksCount: number;
      }[];
    }

    if (authorId) {
      return await db
        .select({
          genreId: genresToBooks.genreId,
          booksCount: sql<number>`${countDistinct(genresToBooks.bookId)} as booksCount`,
        })
        .from(genresToBooks)
        .orderBy(desc(sql`booksCount`))
        .groupBy(genresToBooks.genreId)
        .leftJoin(book, eq(genresToBooks.bookId, book.id))
        .where(eq(book.authorId, authorId));
    }

    return await db
      .select({
        genreId: genresToBooks.genreId,
        booksCount: sql<number>`${countDistinct(genresToBooks.bookId)} as booksCount`,
      })
      .from(genresToBooks)
      .orderBy(desc(sql`booksCount`))
      .groupBy(genresToBooks.genreId);
  },
);
