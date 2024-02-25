import { db } from "@/server/db";
import { author } from "@/server/db/schema";
import { getAuthorsData, getBooksData } from "../fetchers";
import { chunk } from "../utils";

const allAuthors = await getAuthorsData();
const chunkedAuthors = chunk(allAuthors, 100) as (typeof allAuthors)[];

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

let authorBatchIdx = 1;
for (const authors of chunkedAuthors) {
  console.log(
    `[AUTHORS] Seeding batch ${authorBatchIdx} / ${chunkedAuthors.length}`,
  );

  await db.insert(author).values(
    authors.map((authorEntry) => ({
      id: authorEntry.id,
      primaryArabicName: authorEntry.primaryArabicName,
      otherArabicNames: authorEntry.otherArabicNames,
      primaryLatinName: authorEntry.primaryLatinName,
      otherLatinNames: authorEntry.otherLatinNames,
      year: authorEntry.year,
      relatedGeographies: authorEntry.geographies,
      numberOfBooks: authorIdToNumberOfBooks[authorEntry.id] ?? 0,
    })),
  );

  authorBatchIdx++;
}
