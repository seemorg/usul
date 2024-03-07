"use server";

import { db } from "../db";
import { cache } from "react";
import { author, book } from "../db/schema";
import { count, countDistinct } from "drizzle-orm";

export const findAuthorBySlug = cache(async (slug: string) => {
  const author = await db.query.author.findFirst({
    where: (author, { eq, or }) =>
      or(eq(author.slug, slug), eq(author.id, slug)),
    with: {
      locations: {
        with: {
          location: {
            with: {
              region: true,
            },
          },
        },
      },
    },
  });

  if (!author) {
    return;
  }

  // filter duplicate locations
  const locations = author.locations.filter(
    (l, i, arr) =>
      arr.findIndex(
        (l2) =>
          l2.location.regionId === l.location.regionId &&
          l2.location.type === l.location.type,
      ) === i,
  );

  return { ...author, locations };
});

export const findAllAuthorIdsWithBooksCount = cache(async () => {
  const all = await db
    .select({
      authorId: book.authorId,
      booksCount: countDistinct(book.id),
    })
    .from(book)
    .groupBy(book.authorId);

  return all;
});

export const countAllAuthors = cache(async () => {
  const result = await db
    .select({
      count: count(author.id),
    })
    .from(author);

  return result[0]?.count ?? 0;
});
