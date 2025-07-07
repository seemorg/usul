"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";

import { db } from "../db";

export const findAllAuthorIdsWithBooksCount = cache(async () => {
  return await db.author.findMany({
    select: {
      id: true,
      numberOfBooks: true,
    },
  });
});

export const countAllAuthors = cache(
  unstable_cache(
    async () => {
      return await db.author.count();
    },
    ["authors-count"],
    { revalidate: false },
  ),
);
