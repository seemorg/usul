import { cache } from "react";

import { db } from "@/server/db";

import { unstable_cache } from "next/cache";

export const countAllBooks = cache(
  unstable_cache(
    async () => {
      return await db.book.count();
    },
    ["books-count"],
    { revalidate: false },
  ),
);

export const getPopularBooks = cache(async () => {
  const result = await db.book.findMany({
    take: 10,
  });

  return result;
});
