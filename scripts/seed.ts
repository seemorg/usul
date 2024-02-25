import { db } from "@/server/db";
import {
  getAuthorsData,
  getBooksData,
  getParsedBookVersions,
} from "./fetchers";
import { author, book, version } from "@/server/db/schema";
import { chunk } from "./utils";
import type { ParseResult } from "@openiti/markdown-parser";

// const allAuthors = await getAuthorsData();
// const chunkedAuthors = chunk(allAuthors, 100) as (typeof allAuthors)[];

const allBooks = await getBooksData();
// const authorIdToNumberOfBooks = allBooks.reduce(
//   (acc, book) => {
//     const authorId = book.authorId;
//     if (acc[authorId]) {
//       acc[authorId]++;
//     } else {
//       acc[authorId] = 1;
//     }
//     return acc;
//   },
//   {} as Record<string, number>,
// );

// let authorBatchIdx = 1;
// for (const authors of chunkedAuthors) {
//   console.log(
//     `[AUTHORS] Seeding batch ${authorBatchIdx} / ${chunkedAuthors.length}`,
//   );

//   await db.insert(author).values(
//     authors.map((authorEntry) => ({
//       id: authorEntry.id,
//       primaryArabicName: authorEntry.primaryArabicName,
//       otherArabicNames: authorEntry.otherArabicNames,
//       primaryLatinName: authorEntry.primaryLatinName,
//       otherLatinNames: authorEntry.otherLatinNames,
//       year: authorEntry.year,
//       relatedGeographies: authorEntry.geographies,
//       numberOfBooks: authorIdToNumberOfBooks[authorEntry.id] ?? 0,
//     })),
//   );

//   authorBatchIdx++;
// }

// const chunkedBooks = chunk(allBooks, 100) as (typeof allBooks)[];

// let bookBatchIdx = 1;
// for (const books of chunkedBooks) {
//   console.log(`[BOOKS] Seeding batch ${bookBatchIdx} / ${chunkedBooks.length}`);

//   await db.insert(book).values(
//     books.map((bookEntry) => ({
//       id: bookEntry.id,
//       authorId: bookEntry.authorId,
//       primaryArabicName: bookEntry.primaryArabicName,
//       otherArabicNames: bookEntry.otherArabicNames,
//       primaryLatinName: bookEntry.primaryLatinName,
//       otherLatinNames: bookEntry.otherLatinNames,
//       genreTags: bookEntry.genreTags,
//       versionIds: bookEntry.versionIds,
//       numberOfVersions: bookEntry.versionIds.length,
//     })),
//   );

//   bookBatchIdx++;
// }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// DROP ALL DATA in the version table
await db.delete(version).execute();

let versionBatchIdx = 1;
let versionsToSync: {
  id: string;
  bookId: string;
  blocks: ParseResult["content"];
  metadata: ParseResult["metadata"];
}[] = [];
for (const bookEntry of allBooks) {
  console.log(
    `[VERSIONS] Seeding batch ${versionBatchIdx} / ${allBooks.length}`,
  );

  const parsedBookVersions =
    bookEntry.versionIds.length > 0
      ? await getParsedBookVersions(bookEntry.id, bookEntry.versionIds)
      : [];

  if (parsedBookVersions === null) {
    console.log(
      `[VERSIONS] Failed to parse book versions for book ${bookEntry.id}`,
    );

    continue;
  }

  const parsed = parsedBookVersions.map((version, idx) => ({
    id: bookEntry.versionIds[idx]!,
    bookId: bookEntry.id,
    metadata: version.metadata,
    blocks: version.content,
  }));

  const toSyncNow = parsed.length > 60 ? parsed.slice(0, 60) : parsed;
  const toSyncNext = parsed.length > 60 ? parsed.slice(60) : [];

  versionsToSync.push(...toSyncNow);

  if (versionsToSync.length >= 60) {
    try {
      await db.insert(version).values(versionsToSync);
      console.log("[VERSIONS] FLUSHED BATCH");
      versionsToSync = [];
    } catch (e) {
      console.log("[VERSIONS] Failed to insert batch, retrying in 20s...");
      console.error(e);

      let success = false;
      let retries = 0;
      while (!success && retries < 3) {
        retries++;
        await sleep(20000);

        try {
          await db.insert(version).values(versionsToSync);
          console.log("[VERSIONS] RETRY SUCCESSFUL");
          success = true;
        } catch (e) {
          console.log("[VERSIONS] RETRY FAILED");
          console.error(e);
        }
      }

      // if we still failed after 3 retries, we'll exit the script
      if (!success) {
        console.log("[VERSIONS] FAILED AFTER 3 RETRIES, EXITING");
        process.exit(1);
      }
    }
  }

  if (toSyncNext.length > 0) {
    versionsToSync.push(...toSyncNext);
  }

  versionBatchIdx++;
}
