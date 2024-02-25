import { db } from "@/server/db";
import { getBooksData } from "../fetchers";
import { chunk } from "../utils";
import { book } from "@/server/db/schema";

const allBooks = await getBooksData();
const chunkedBooks = chunk(allBooks, 100) as (typeof allBooks)[];

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
      genreTags: bookEntry.genreTags,
      versionIds: bookEntry.versionIds,
      numberOfVersions: bookEntry.versionIds.length,
    })),
  );

  bookBatchIdx++;
}
