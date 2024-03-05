import { db } from "@/server/db";
import { author, locationsToAuthors } from "@/server/db/schema";
import { getAuthorsData, getBooksData } from "../fetchers";
import { chunk, slugifyId } from "../utils";
import authorBios from "../../data/author-bios.json";

const allAuthors = await getAuthorsData();
const chunkedAuthors = chunk(allAuthors, 100) as (typeof allAuthors)[];

const getAuthorBio = (id: string) => {
  return (authorBios as Record<string, { bio: string }>)[id]?.bio ?? undefined;
};

const allBooks = await getBooksData();
const authorIdToNumberOfBooks = allBooks.reduce(
  (acc, book) => {
    const authorId = book.authorId;
    if (acc[authorId]) {
      acc[authorId]++;
    } else {
      acc[authorId] = 1;
    }
    return acc;
  },
  {} as Record<string, number>,
);

const shouldReset =
  process.argv.includes("--reset") || process.argv.includes('"--reset"');
if (shouldReset) {
  console.log("[AUTHORS] Resetting authors table");
  await db.delete(author);
  await db.delete(locationsToAuthors);
}

const slugs = new Set<string>();
const createUniqueSlug = (id: string) => {
  let number = 0;
  while (true) {
    const slug = number === 0 ? slugifyId(id) : `${slugifyId(id)}-${number}`;
    if (!slugs.has(slug)) {
      slugs.add(slug);
      return slug;
    }

    number++;
  }
};

let authorBatchIdx = 1;
for (const authors of chunkedAuthors) {
  console.log(
    `[AUTHORS] Seeding batch ${authorBatchIdx} / ${chunkedAuthors.length}`,
  );

  await db.insert(author).values(
    authors.map((authorEntry) => ({
      id: authorEntry.id,
      slug: createUniqueSlug(authorEntry.id),
      ...(getAuthorBio(authorEntry.id)
        ? { bio: getAuthorBio(authorEntry.id) }
        : {}),
      primaryArabicName: authorEntry.primaryArabicName,
      otherArabicNames: authorEntry.otherArabicNames,
      primaryLatinName: authorEntry.primaryLatinName,
      otherLatinNames: authorEntry.otherLatinNames,
      year: authorEntry.year,
      numberOfBooks: authorIdToNumberOfBooks[authorEntry.id] ?? 0,
      // relatedGeographies: authorEntry.geographies,
    })),
  );

  const locationEntries = authors.flatMap((authorEntry) => {
    return [
      ...new Set(authorEntry.geographies.map((g) => g.toLowerCase())),
    ].map((geography) => ({
      locationId: geography,
      authorId: authorEntry.id,
    }));
  });

  if (locationEntries.length > 0) {
    await db.insert(locationsToAuthors).values(locationEntries);
  }

  authorBatchIdx++;
}
