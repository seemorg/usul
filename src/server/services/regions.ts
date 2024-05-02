"use server";

import { cache } from "react";
import { db } from "../db";
import { getLocaleWhereClause } from "../db/localization";
import type { PathLocale } from "@/lib/locale/utils";

export const findAllRegionsWithCounts = cache(
  async (locale: PathLocale = "en") => {
    const localeWhere = getLocaleWhereClause(locale);

    return await db.region.findMany({
      include: {
        nameTranslations: localeWhere,
        overviewTranslations: localeWhere,
        currentNameTranslations: localeWhere,
      },
    });
  },
);

export const findRegionBySlug = cache(
  async (slug: string, locale: PathLocale = "en") => {
    const localeWhere = getLocaleWhereClause(locale);

    const region = await db.region.findUnique({
      where: {
        slug,
      },
      include: {
        locations: {
          include: {
            cityNameTranslations: localeWhere,
          },
        },
        nameTranslations: localeWhere,
        overviewTranslations: localeWhere,
        currentNameTranslations: localeWhere,
      },
    });

    if (!region) {
      return;
    }

    return region;
  },
);

export const findAllRegionsWithBooksCount = cache(
  async (
    {
      yearRange,
      genreId,
      countType = "books",
    }: {
      yearRange?: [number, number];
      genreId?: string;
      countType?: "books" | "authors";
    } = {},
    locale: PathLocale = "en",
  ) => {
    const localeWhere = getLocaleWhereClause(locale);

    if (countType === "authors") {
      const data = await db.region.findMany({
        orderBy: { numberOfAuthors: "desc" },
        include: {
          locations: {
            include: {
              cityNameTranslations: localeWhere,
            },
          },
          nameTranslations: localeWhere,
          overviewTranslations: localeWhere,
          currentNameTranslations: localeWhere,
        },
      });

      return data.map((region) => ({
        ...region,
        count: region.numberOfAuthors,
      }));
    }

    const data = await db.region.findMany({
      include: {
        nameTranslations: localeWhere,
        overviewTranslations: localeWhere,
        currentNameTranslations: localeWhere,

        locations: {
          include: {
            cityNameTranslations: localeWhere,
          },
          select: {
            authors: {
              ...(yearRange && {
                where: {
                  year: {
                    gte: yearRange[0],
                    lt: yearRange[1],
                  },
                },
              }),
              include: {
                _count: {
                  select: {
                    books: !genreId
                      ? true
                      : {
                          where: {
                            genres: {
                              some: {
                                id: genreId,
                              },
                            },
                          },
                        },
                  },
                },
              },
            },
          },
        },
      },
    });

    return data.map(({ locations, ...region }) => {
      const totalBooks = locations.reduce(
        (acc, loc) =>
          acc +
          loc.authors.reduce((acc2, author) => acc2 + author._count.books, 0),
        0,
      );

      return {
        ...region,
        count: totalBooks,
      };
    });
  },
);

export const countAllRegions = cache(async () => {
  return await db.region.count();
});
