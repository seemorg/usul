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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const regions = await db.region.findMany({
    select: { slug: true },
  });

  const centuries = await findAllYearRanges();

  const books = await db.book.findMany({
    select: { slug: true },
  });

  const authors = await db.author.findMany({
    select: { slug: true },
  });

  const genres = await db.genre.findMany({
    select: { slug: true },
  });

  return [
    // home page
    generateEntryFromUrl("/"),
    // root entities
    ...rootEntityPages.map((entityUrl) => generateEntryFromUrl(entityUrl)),
    ...books.map((book) =>
      generateEntryFromUrl(navigation.books.reader(book.slug)),
    ),
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
