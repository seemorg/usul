"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { book } from "../db/schema";
import { cache } from "react";

export const findAuthorBySlug = cache(async (slug: string) => {
  const author = await db.query.author.findFirst({
    where: (author, { eq }) => eq(author.slug, slug),
  });

  if (!author) {
    return;
  }

  const distinctGenres = [
    ...new Set(
      (
        await db
          .select({
            genreTags: book.genreTags,
          })
          .from(book)
          .where(eq(book.authorId, author.id))
      ).flatMap((g) => g.genreTags),
    ),
  ];

  return {
    ...author,
    genreTags: distinctGenres,
  };
});
