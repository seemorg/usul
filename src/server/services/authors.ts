"use server";

import type { PathLocale } from "@/lib/locale/utils";
import { db } from "../db";
import { cache } from "react";
import { getLocaleWhereClause } from "../db/localization";

export const findAuthorBySlug = cache(
  async (slug: string, locale: PathLocale = "en") => {
    const localeWhere = getLocaleWhereClause(locale);

    const author = await db.author.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        locations: {
          include: {
            cityNameTranslations: localeWhere,
            region: {
              include: {
                nameTranslations: localeWhere,
              },
            },
          },
        },
        primaryNameTranslations: localeWhere,
        otherNameTranslations: localeWhere,
        bioTranslations: localeWhere,
      },
    });

    if (!author) {
      return;
    }

    // filter duplicate locations
    const locations = author.locations.filter(
      (l, i, arr) =>
        arr.findIndex(
          (l2) => l2.regionId === l.regionId && l2.type === l.type,
        ) === i,
    );

    return { ...author, locations };
  },
);

export const findAllAuthorIdsWithBooksCount = cache(async () => {
  return await db.author.findMany({
    select: {
      id: true,
      numberOfBooks: true,
    },
  });
});

export const countAllAuthors = cache(async () => {
  return await db.author.count();
});
