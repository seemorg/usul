import { db } from "@/server/db";
import { getBooksData } from "../fetchers";
import { chunk, slugifyId, toTitleCase } from "../utils";
import { genre } from "@/server/db/schema";

const allBooks = await getBooksData();
const allGenres = [
  ...new Set<string>(
    allBooks.flatMap((book) => book.genreTags.map((g) => g.toLowerCase())),
  ),
];
const chunkedGenres = chunk(allGenres, 100) as (typeof allGenres)[];

const slugs = new Set<string>();
const createUniqueSlug = (id: string) => {
  const name = toReadableName(id);
  let number = 0;

  while (true) {
    const slug =
      number === 0
        ? slugifyId(name, false)
        : `${slugifyId(name, false)}-${number}`;
    if (!slugs.has(slug)) {
      slugs.add(slug);
      return slug;
    }

    number++;
  }
};

const toReadableName = (id: string) => {
  const formatted = id.replace(/_/g, " ").replace(/-/g, " ").trim();

  const [src, newName] = formatted.split("@");
  return toTitleCase((newName ?? src) as string);
};

const shouldReset =
  process.argv.includes("--reset") || process.argv.includes('"--reset"');
if (shouldReset) {
  console.log("[GENRES] Resetting genres table");
  await db.delete(genre);
}

let genreBatchIdx = 1;
for (const genres of chunkedGenres) {
  console.log(
    `[GENRES] Seeding batch ${genreBatchIdx} / ${chunkedGenres.length}`,
  );

  try {
    await db.insert(genre).values(
      genres.map((genreEntry) => ({
        id: genreEntry,
        slug: createUniqueSlug(genreEntry),
        name: toReadableName(genreEntry),
      })),
    );
  } catch (e) {
    console.log(
      genres.map((genreEntry) => ({
        id: genreEntry,
        slug: createUniqueSlug(genreEntry),
        name: toReadableName(genreEntry),
      })),
    );

    console.log(e);
  }

  genreBatchIdx++;
}
