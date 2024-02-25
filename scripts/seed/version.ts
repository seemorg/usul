import { db } from "@/server/db";
import { getBooksData, getParsedBookVersions } from "../fetchers";
import { version } from "@/server/db/schema";
import { chunk } from "../utils";
import { sql } from "drizzle-orm";

const CHUNK_SIZE = 5;

const allBooks = await getBooksData();

// DROP ALL DATA in the version table
await db.execute(sql`DELETE * FROM version`);
console.log("[VERSIONS] Deleted all data from the version table");

let versionBatchIdx = 0;
let versionsToSync: {
  id: string;
  bookId: string;
  content: string;
}[] = [];

for (const bookEntry of allBooks) {
  versionBatchIdx++;
  console.log(
    `[VERSIONS] Processing book ${versionBatchIdx} / ${allBooks.length}`,
  );

  const currentBookVersions =
    bookEntry.versionIds.length > 0
      ? await getParsedBookVersions(bookEntry.id, bookEntry.versionIds)
      : [];

  if (currentBookVersions === null) {
    console.log(
      `[VERSIONS] Failed to parse book versions for book ${bookEntry.id}`,
    );

    continue;
  }

  const parsed = currentBookVersions.map((versionContent, idx) => ({
    id: bookEntry.versionIds[idx]!,
    bookId: bookEntry.id,
    content: versionContent,
  }));

  versionsToSync.push(...parsed);

  if (versionsToSync.length < CHUNK_SIZE) {
    continue;
  }

  const chunks = chunk(versionsToSync, CHUNK_SIZE) as (typeof versionsToSync)[];

  for (const versionToSyncChunk of chunks) {
    try {
      await db.insert(version).values(versionToSyncChunk);
      console.log("[VERSIONS] FLUSHED BATCH");
      versionsToSync = [];
    } catch (e) {
      console.log(
        "[VERSIONS] Failed to insert batch, inserting every value on its own...",
      );
      console.error(e);

      for (const versionToSync of versionToSyncChunk) {
        try {
          await db.insert(version).values(versionToSync);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}
