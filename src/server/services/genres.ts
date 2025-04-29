"use server";

import type { PathLocale } from "@/lib/locale/utils";
import { cache } from "react";
import { unstable_cache } from "next/cache";

import { db } from "../db";
import { getLocaleWhereClause } from "../db/localization";

export const findAllGenres = cache(async (locale: PathLocale = "en") => {
  const localeWhere = getLocaleWhereClause(locale);

  return await db.genre.findMany({
    include: {
      nameTranslations: localeWhere,
    },
  });
});

export const findGenreBySlug = cache(
  async (slug: string, locale: PathLocale = "en") => {
    const localeWhere = getLocaleWhereClause(locale);

    const genreRecord = await db.genre.findUnique({
      where: {
        slug,
      },
      include: {
        nameTranslations: localeWhere,
      },
    });

    if (!genreRecord) {
      return;
    }

    return genreRecord;
  },
);

export const findAllGenresWithBooksCount = cache(
  async ({
    yearRange,
    authorId,
    bookIds,
    regionId,
    locale = "en",
  }: {
    yearRange?: [number, number];
    bookIds?: string[];
    authorId?: string;
    regionId?: string;
    locale?: PathLocale;
  } = {}) => {
    const localeWhere = getLocaleWhereClause(locale);

    const base = await db.genre.findMany({
      include: {
        _count: {
          select: {
            books: {
              where: {
                ...(bookIds && {
                  id: {
                    in: bookIds,
                  },
                }),
                ...(yearRange && {
                  AND: {
                    author: {
                      year: {
                        gte: yearRange[0],
                        lt: yearRange[1],
                      },
                    },
                  },
                }),
                ...(regionId && {
                  author: {
                    locations: {
                      some: {
                        regionId,
                      },
                    },
                  },
                }),
                ...(authorId && {
                  authorId,
                }),
              },
            },
          },
        },
        nameTranslations: localeWhere,
      },
    });

    return base
      .filter((g) => g._count.books > 0)
      .sort((a, b) => b._count.books - a._count.books);
  },
);

export const countAllGenres = cache(
  unstable_cache(
    async () => {
      const result = await db.genre.count();
      return result;
    },
    ["genres-count"],
    { revalidate: false },
  ),
);
