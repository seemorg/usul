"use server";

import { cache } from "react";
import { db } from "../db";
import {
  author,
  book,
  genresToBooks,
  location,
  locationsToAuthors,
  region,
} from "../db/schema";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  lt,
  or,
  sql,
} from "drizzle-orm";

export const findAllRegionsWithCounts = cache(async () => {
  const all = await db
    .select({
      region: region,
      booksCount: sql<number>`${countDistinct(book.id)} as booksCount`,
      authorsCount: sql<number>`${countDistinct(locationsToAuthors.authorId)} as authorsCount`,
    })
    .from(location)
    .leftJoin(region, eq(location.regionId, region.id))
    .leftJoin(
      locationsToAuthors,
      eq(location.id, locationsToAuthors.locationId),
    )
    .leftJoin(book, eq(locationsToAuthors.authorId, book.authorId))
    .groupBy(location.regionId);

  return all
    .filter((r) => !!r.region)
    .map(({ region, ...rest }) => ({ ...region, ...rest }));
});

export const findRegionBySlug = cache(async (slug: string) => {
  const region = await db.query.region.findFirst({
    where: (r) => eq(r.slug, slug),
  });

  if (!region) {
    return;
  }

  const results = await db
    .select()
    .from(location)
    .where(
      or(
        ...["died", "born", "visited", "resided"].map((type) => {
          return and(eq(location.type, type), eq(location.regionId, region.id));
        }),
      ),
    );

  return {
    region,
    subLocations: results,
  };
});

export const findAllRegionsWithBooksCount = cache(
  async (
    {
      yearRange,
      genreId,
    }: {
      yearRange?: [number, number];
      genreId?: string;
    } = {},
    countType: "books" | "authors" = "books",
  ) => {
    let q;

    if (countType === "authors") {
      q = db
        .select({
          region: region,
          authorsCount: sql<number>`${countDistinct(locationsToAuthors.authorId)} as authorsCount`,
        })
        .from(location)
        .leftJoin(region, eq(location.regionId, region.id))
        .leftJoin(
          locationsToAuthors,
          eq(location.id, locationsToAuthors.locationId),
        )
        .groupBy(location.regionId)
        .orderBy(desc(sql`authorsCount`))
        .$dynamic();
    } else {
      q = db
        .select({
          region: region,
          booksCount: sql<number>`${countDistinct(book.id)} as booksCount`,
        })
        .from(locationsToAuthors)
        .leftJoin(location, eq(locationsToAuthors.locationId, location.id))
        .leftJoin(region, eq(location.regionId, region.id))
        .leftJoin(book, eq(locationsToAuthors.authorId, book.authorId))
        .groupBy(location.regionId)
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
    }

    const results: {
      name: string;
      slug: string;
      count: number;
    }[] = [];

    (await q).forEach((r: any) => {
      if (!r.region) return;

      results.push({
        name: r.region.name as string,
        slug: r.region.slug,
        count: r.booksCount ?? r.authorsCount,
      });
    });

    return results;
  },
);

export const countAllRegions = cache(async () => {
  const result = await db
    .select({
      count: count(region.id),
    })
    .from(region);

  return result[0]?.count ?? 0;
});
