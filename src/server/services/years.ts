"use server";

import { cache } from "react";
import descriptions from "~/data/centuries.json";
import { db } from "../db";
import { count, eq, sql } from "drizzle-orm";
import { author, book } from "../db/schema";

export const findAllYearRanges = cache(async () => {
  const counts = await countAllBooksByCentury();

  const years: {
    yearFrom: number;
    yearTo: number;
    centuryNumber: number;
    description: string;
    totalBooks: number;
  }[] = [];

  for (let i = 0; i <= 1400; i += 100) {
    const century = i / 100 + 1;
    years.push({
      yearFrom: i === 0 ? 1 : i,
      yearTo: i + 100,
      centuryNumber: century,
      description: (descriptions as any)[String(century)]?.summary,
      totalBooks: counts.find((c) => c.century === String(century))?.count || 0,
    });
  }

  return years;
});

export const findYearRangeBySlug = cache((slug: string | number) => {
  const allRanges = findAllYearRanges();

  if (!slug) {
    return;
  }

  return allRanges.find((r) => r.centuryNumber === Number(slug));
});

export const countAllBooksByCentury = cache(async () => {
  const result = await db
    .select({
      count: count(book.id),
      century: sql<string | null>`FLOOR(${author.year} / 100) + 1 AS century`,
    })
    .from(book)
    .leftJoin(author, eq(book.authorId, author.id))
    .groupBy(sql`century`);

  return result;
});
