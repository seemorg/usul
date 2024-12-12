import { env } from "@/env";
import { localesWithoutDefault, relativeUrl } from "@/lib/sitemap";
import { navigation } from "@/lib/urls";
import { db } from "@/server/db";
import { findAllYearRanges } from "@/server/services/years";
import type { MetadataRoute } from "next";

const rootEntityPages = [
  navigation.books.all(),
  navigation.authors.all(),
  navigation.centuries.all(),
  navigation.regions.all(),
  navigation.genres.all(),
];

const generateEntryFromUrl = (url: string) => ({
  url: relativeUrl(url),
  lastModified: new Date(),
  alternates: {
    languages: localesWithoutDefault.reduce(
      (acc, locale) => {
        acc[locale] = relativeUrl(`/${locale}${url === "/" ? "" : url}`);
        return acc;
      },
      {} as Record<string, string>,
    ),
  },
});

const isProd = env.VERCEL_ENV === "production";

export function generateSitemaps() {
  // TODO: for now we have only 2 sitemaps, change that later to be dynamic
  return [{ id: 1 }, { id: 2 }] as const;
}

export default async function sitemap(
  params: ReturnType<typeof generateSitemaps>[number],
): Promise<MetadataRoute.Sitemap> {
  if (!isProd) return [];

  if (params.id === 1) {
    const regions = await db.region.findMany({
      select: { slug: true },
    });
    const centuries = await findAllYearRanges();
    const authors = await db.author.findMany({
      select: { slug: true },
    });
    const genres = await db.genre.findMany({
      select: { slug: true },
    });

    return [
      // home page
      generateEntryFromUrl("/"),
      // about page
      generateEntryFromUrl("/about"),
      // team page
      generateEntryFromUrl("/team"),
      // root entities
      ...rootEntityPages.map((entityUrl) => generateEntryFromUrl(entityUrl)),
      ...authors.map((author) =>
        generateEntryFromUrl(navigation.authors.bySlug(author.slug)),
      ),
      ...centuries.map((century) =>
        generateEntryFromUrl(
          navigation.centuries.byNumber(century.centuryNumber),
        ),
      ),
      ...regions.map((region) =>
        generateEntryFromUrl(navigation.regions.bySlug(region.slug)),
      ),
      ...genres.map((genre) =>
        generateEntryFromUrl(navigation.genres.bySlug(genre.slug)),
      ),
    ];
  }

  const books = await db.book.findMany({
    select: { slug: true },
  });

  return [
    ...books.map((book) =>
      generateEntryFromUrl(navigation.books.reader(book.slug)),
    ),
  ];
}
