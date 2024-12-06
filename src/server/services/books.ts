import { cache } from "react";

import { db } from "@/server/db";

import { getLocaleWhereClause } from "../db/localization";
import type { fetchTurathBook } from "./book-fetchers/turath";
import type { fetchOpenitiBook } from "./book-fetchers/openiti";
import { unstable_cache } from "next/cache";

export type TurathBookResponse = {
  source: "turath";
  versionId: string;
  book: Awaited<ReturnType<typeof getBook>>;
} & Awaited<ReturnType<typeof fetchTurathBook>>;

export type OpenitiBookResponse = {
  source: "openiti";
  versionId: string;
  book: Awaited<ReturnType<typeof getBook>>;
} & Awaited<ReturnType<typeof fetchOpenitiBook>>;

export type ExternalBookResponse = {
  source: "external";
  versionId: string;
  book: Awaited<ReturnType<typeof getBook>>;
};

const getBook = async (id: string, locale: string) => {
  const localeWhere = getLocaleWhereClause(locale);

  const record = await db.book.findFirst({
    where: {
      slug: id,
    },
    include: {
      author: {
        include: {
          primaryNameTranslations: localeWhere,
          otherNameTranslations: localeWhere,
          bioTranslations: localeWhere,
        },
      },
      genres: {
        include: { nameTranslations: localeWhere },
      },
      primaryNameTranslations: localeWhere,
      otherNameTranslations: localeWhere,
    },
  });

  if (!record) {
    throw new Error("Book not found");
  }

  return record;
};

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
