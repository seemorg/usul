"use server";

import { cache } from "react";
import { db } from "../db";
import {
  author,
  book,
  genresToBooks,
  location,
  locationsToAuthors,
} from "../db/schema";
import { and, countDistinct, desc, eq, gte, lt, or, sql } from "drizzle-orm";

import data from "~/data/distinct-regions.json";

type Region = {
  code: string;
  slug: string;
  overview: string;
  nameArabic: string;
  currentPlace: string;
};

export const findAllRegions = cache(async () => {
  return Object.values(data) as Region[];
});

export const findRegionBySlug = cache(async (slug: string) => {
  const region = (data as Record<string, Region>)[slug];

  if (!region) {
    return;
  }

  const results = await db
    .select({
      subLocationsCount: countDistinct(location.id),
    })
    .from(locationsToAuthors)
    .leftJoin(location, eq(locationsToAuthors.locationId, location.id))
    .where(
      or(
        ...["died", "born", "visited", "resided"].map((type) => {
          return and(
            eq(location.type, type),
            eq(location.regionCode, region.code),
          );
        }),
      ),
    )
    .groupBy(location.regionCode);

  return {
    region,
    subLocationsCount: results[0]?.subLocationsCount ?? 0,
  };
});

const codeToRegion = Object.fromEntries(
  Object.entries(data).map(([, region]) => [region.code, region]),
);

export const findAllRegionsWithBooksCount = cache(
  async ({
    yearRange,
    genreId,
  }: {
    yearRange?: [number, number];
    genreId?: string;
  } = {}) => {
    let q = db
      .select({
        location: location.regionCode,
        booksCount: sql<number>`${countDistinct(book.id)} as booksCount`,
      })
      .from(locationsToAuthors)
      .leftJoin(location, eq(locationsToAuthors.locationId, location.id))
      .leftJoin(book, eq(locationsToAuthors.authorId, book.authorId))
      .groupBy(location.regionCode)
      .orderBy(desc(sql`booksCount`))
      .$dynamic();

    if (genreId) {
      q = q
        .leftJoin(genresToBooks, eq(genresToBooks.bookId, book.id))
        .where(eq(genresToBooks.genreId, genreId));
    }

    if (yearRange) {
      q = q
        .leftJoin(author, eq(author.id, locationsToAuthors.authorId))
        .where(
          and(gte(author.year, yearRange[0]), lt(author.year, yearRange[1])),
        );
    }

    const results: {
      name: string;
      slug: string;
      count: number;
    }[] = [];

    (await q).forEach((r) => {
      if (!r.location) return;

      results.push({
        name: codeToRegion[r.location]?.code as string,
        slug: codeToRegion[r.location]?.slug as string,
        count: r.booksCount,
      });
    });

    return results;
  },
);
