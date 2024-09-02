import { cache } from "react";

import { db } from "@/server/db";

import type { PathLocale } from "@/lib/locale/utils";
import { getLocaleWhereClause } from "../db/localization";
import { fetchTurathBook } from "./book-fetchers/turath";
import { fetchOpenitiBook } from "./book-fetchers/openiti";
import { log } from "next-axiom";

export type TurathBookResponse = {
  source: "turath";
  book: Awaited<ReturnType<typeof getBook>>;
} & Awaited<ReturnType<typeof fetchTurathBook>>;

export type OpenitiBookResponse = {
  source: "openiti";
  book: Awaited<ReturnType<typeof getBook>>;
} & Awaited<ReturnType<typeof fetchOpenitiBook>>;

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
      genres: true,
      primaryNameTranslations: localeWhere,
      otherNameTranslations: localeWhere,
    },
  });

  if (!record) {
    throw new Error("Book not found");
  }

  return record;
};

export const fetchBook = cache(
  async (id: string, locale: PathLocale = "en", versionId?: string) => {
    const record = await getBook(id, locale);

    const allVersions = record.versions;

    let version: PrismaJson.BookVersion | undefined;
    if (versionId) {
      version = allVersions.find((v) => v.value === versionId);
    }

    if (!version) {
      // if the first 2 versions are turath, use the 2nd one
      // otherwise, just use the first version
      if (
        allVersions[0]?.source === "turath" &&
        allVersions[1]?.source === "turath"
      ) {
        version = allVersions[1];
      } else {
        version = allVersions[0];
      }
    }

    if (!version) {
      throw new Error("Book not found");
    }

    if (version.source === "turath") {
      const turathBook = await fetchTurathBook(version.value);
      return {
        versionId: version.value,
        source: version.source,
        book: record,
        ...turathBook,
      };
    }

    try {
      const openitiBook = await fetchOpenitiBook({
        authorId: record.author.id,
        bookId: record.id,
        versionId: version.value,
      });
      return {
        versionId: version.value,
        source: version.source,
        book: record,
        ...openitiBook,
      };
    } catch (e) {
      log.error("book_not_found", { slug: id, versionId });
      await log.flush();
      throw e;
    }
  },
);

export const countAllBooks = cache(async () => {
  return await db.book.count();
});

export const getPopularBooks = cache(async () => {
  const result = await db.book.findMany({
    take: 10,
  });

  return result;
});
