"use server";

import { cache } from "react";
import descriptions from "~/data/centuries.json";

export const findAllYearRanges = cache(() => {
  const years: {
    yearFrom: number;
    yearTo: number;
    centuryNumber: number;
    description: string;
  }[] = [];

  for (let i = 0; i <= 1500; i += 100) {
    const century = i / 100 + 1;
    years.push({
      yearFrom: i === 0 ? 1 : i,
      yearTo: i + 100,
      centuryNumber: century,
      description: (descriptions as any)[String(century)]?.summary,
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
