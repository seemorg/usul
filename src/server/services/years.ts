// "use server";

import { cache } from "react";
import descriptions from "~/data/centuries.json";
import { db } from "../db";
import { unstable_cache } from "next/cache";

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
      description: (descriptions as Record<string, { summary: string }>)[
        String(century)
      ]!.summary,
      totalBooks: counts.find((c) => c.century === century)?.count || 0,
    });
  }

  return years;
});

export const findYearRangeBySlug = cache(async (slug: string | number) => {
  const allRanges = await findAllYearRanges();

  if (!slug) {
    return;
  }

  return allRanges.find((r) => r.centuryNumber === Number(slug));
});

export const countAllBooksByCentury = cache(
  unstable_cache(
    async () => {
      const result = await db.$queryRaw<{ century: number; count: number }[]>`
SELECT 
FLOOR("Author"."year" / 100) + 1 AS "century", 
COUNT("Book"."id")::int as count
FROM "Book"
LEFT JOIN "Author" ON "Book"."authorId" = "Author"."id"
GROUP BY "century" 
  `;

      return result;
    },
    ["years-count"],
    { revalidate: false },
  ),
);
