import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { localesWithoutDefault, relativeUrl } from "@/lib/sitemap";
import { navigation } from "@/lib/urls";
import { db } from "@/server/db";
import { findAllYearRanges } from "@/server/services/years";

const rootEntityPages = [
  navigation.books.all(),
  navigation.authors.all(),
  navigation.centuries.all(),
  navigation.regions.all(),
  navigation.genres.all(),
];

const generateEntryFromUrl = (url: string) => {
  const finalUrl = relativeUrl(url);
  const lastModified = new Date();
  const alternates = localesWithoutDefault.map((locale) => {
    const urlWithLocale = relativeUrl(`/${locale}${url === "/" ? "" : url}`);
    return `<xhtml:link rel="alternate" hreflang="${locale}" href="${urlWithLocale}" />`;
  });

  return `
  <url>
<loc>${finalUrl}</loc>
${alternates}

<lastmod>${lastModified.toISOString()}</lastmod>
</url>
  `;
};

export async function generateStaticParams() {
  return [1, 2, 3].map((id) => ({
    id: id.toString(),
  }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // const isProd = env.VERCEL_ENV === "production";
  // if (!isProd) {
  //   return new Response("Not found", { status: 404 });
  // }

  const partId = id.split(".")[0];
  const partNumber = Number(partId);

  if (
    !partId ||
    !id.endsWith(".xml") ||
    isNaN(partNumber) ||
    partNumber < 1 ||
    partNumber > 3
  ) {
    notFound();
  }

  let entries = "";

  if (partNumber === 1) {
    // home page
    entries += generateEntryFromUrl("/");

    // about page
    entries += generateEntryFromUrl("/about");

    // team page
    entries += generateEntryFromUrl("/team");

    // donate page
    entries += generateEntryFromUrl("/donate");

    // root entities
    rootEntityPages.forEach((entityUrl) => {
      entries += generateEntryFromUrl(entityUrl);
    });

    // authors
    const authors = await db.author.findMany({
      select: { slug: true },
    });
    authors.forEach((author) => {
      entries += generateEntryFromUrl(navigation.authors.bySlug(author.slug));
    });

    const regions = await db.region.findMany({
      select: { slug: true },
    });
    regions.forEach((region) => {
      entries += generateEntryFromUrl(navigation.regions.bySlug(region.slug));
    });

    const centuries = await findAllYearRanges();
    centuries.forEach((century) => {
      entries += generateEntryFromUrl(
        navigation.centuries.byNumber(century.centuryNumber),
      );
    });

    const genres = await db.genre.findMany({
      select: { slug: true },
    });
    genres.forEach((genre) => {
      entries += generateEntryFromUrl(navigation.genres.bySlug(genre.slug));
    });
  } else if (partNumber === 2) {
    const books = await db.book.findMany({
      select: { slug: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 7000,
    });

    books.forEach((book) => {
      entries += generateEntryFromUrl(navigation.books.reader(book.slug));
    });
  } else if (partNumber === 3) {
    const books = await db.book.findMany({
      select: { slug: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: 7000,
    });

    books.forEach((book) => {
      entries += generateEntryFromUrl(navigation.books.reader(book.slug));
    });
  }

  const sitemap = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
