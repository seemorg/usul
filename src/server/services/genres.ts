"use server";

import { cache } from "react";
import { db } from "../db";
import { unstable_cache } from "next/cache";

export const findAllGenres = cache(async () => {
  return await db.genre.findMany();
});

export const findGenreBySlug = cache(async (slug: string) => {
  const genreRecord = await db.genre.findUnique({
    where: {
      slug,
    },
  });

  if (!genreRecord) {
    return;
  }

  return genreRecord;
});

export const findAllGenresWithBooksCount = cache(
  async ({
    yearRange,
    authorId,
    regionId,
  }: {
    yearRange?: [number, number];
    authorId?: string;
    regionId?: string;
  } = {}) => {
    const base = await db.genre.findMany({
      include: {
        _count: {
          select: {
            books: {
              where: {
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
