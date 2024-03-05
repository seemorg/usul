import { db } from "@/server/db";
import { getBooksData } from "../fetchers";
import { chunk } from "../utils";
import { book, genresToBooks } from "@/server/db/schema";

const allBooks = await getBooksData();
const chunkedBooks = chunk(allBooks, 100) as (typeof allBooks)[];

const shouldReset =
  process.argv.includes("--reset") || process.argv.includes('"--reset"');
if (shouldReset) {
  console.log("[BOOKS] Resetting books table");
  await db.delete(book);
  await db.delete(genresToBooks);
}

let bookBatchIdx = 1;
for (const books of chunkedBooks) {
  console.log(`[BOOKS] Seeding batch ${bookBatchIdx} / ${chunkedBooks.length}`);

  await db.insert(book).values(
    books.map((bookEntry) => ({
      id: bookEntry.id,
      authorId: bookEntry.authorId,
      primaryArabicName: bookEntry.primaryArabicName,
      otherArabicNames: bookEntry.otherArabicNames,
      primaryLatinName: bookEntry.primaryLatinName,
      otherLatinNames: bookEntry.otherLatinNames,
      // genreTags: bookEntry.genreTags,
      versionIds: bookEntry.versionIds,
      numberOfVersions: bookEntry.versionIds.length,
    })),
  );

  const genreEntries = books.flatMap((bookEntry) => {
    return [...new Set(bookEntry.genreTags.map((g) => g.toLowerCase()))].map(
      (genreTag) => ({
        genreId: genreTag,
        bookId: bookEntry.id,
      }),
    );
  });

  if (genreEntries.length > 0) {
    await db.insert(genresToBooks).values(genreEntries);
  }

  bookBatchIdx++;
}
