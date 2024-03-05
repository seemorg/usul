import { db } from "@/server/db";
import { getAuthorsData } from "../fetchers";
import { chunk, slugifyId, toTitleCase } from "../utils";
import { location as locationTable } from "@/server/db/schema";
import locationsWithRegions from "../../data/distinct-locations-with-regions.json";

const allAuthors = await getAuthorsData();

// example: { "Jazirat_Arab": ['died', 'born'] }
const locationsToTypes = [
  ...new Set<string>(
    allAuthors.flatMap((author) =>
      author.geographies.map((g) => g.toLowerCase()),
    ),
  ),
].reduce(
  (acc, location) => {
    const [prefix, name] = location.split("@") as [string, string];
    if (acc[name]) {
      acc[name]!.push(prefix);
    } else {
      acc[name] = [prefix];
    }
    return acc;
  },
  {} as Record<string, string[]>,
);
const allLocations = Object.keys(locationsToTypes);

const chunkedLocations = chunk(allLocations, 10) as (typeof allLocations)[];

const locationToRegionData = locationsWithRegions.reduce(
  (acc, entry) => {
    acc[entry.location.toLowerCase()] = entry.region ?? null;
    return acc;
  },
  {} as Record<string, { code: string } | null>,
);

const slugs = new Set<string>();
const createUniqueSlug = (id: string) => {
  const name = toReadableName(id);
  let number = 0;

  while (true) {
    const slug =
      number === 0 ? slugifyId(name) : `${slugifyId(name)}-${number}`;
    if (!slugs.has(slug)) {
      slugs.add(slug);
      return slug;
    }

    number++;
  }
};

const toReadableName = (location: string) => {
  return toTitleCase(
    location
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .trim(),
  );
};

const shouldReset =
  process.argv.includes("--reset") || process.argv.includes('"--reset"');
if (shouldReset) {
  console.log("[LOCATIONS] Resetting genres table");
  await db.delete(locationTable);
}

let locationBatchIdx = 1;
for (const locations of chunkedLocations) {
  console.log(
    `[LOCATIONS] Seeding batch ${locationBatchIdx} / ${chunkedLocations.length}`,
  );

  const locationsWithTypes = locations.flatMap((location) => {
    const name = toReadableName(location);
    const slug = createUniqueSlug(location);

    return (locationsToTypes[location] ?? []).map((type) => {
      const id = `${type}@${location}`;

      return {
        id,
        slug: slug,
        name: name,
        type,
        regionCode: locationToRegionData[id.toLowerCase()]?.code ?? null,
      };
    });
  });

  await db.insert(locationTable).values(
    locationsWithTypes.map((locationEntry) => ({
      id: locationEntry.id,
      slug: locationEntry.slug,
      name: locationEntry.name,
      type: locationEntry.type,
      ...(locationEntry.regionCode && { regionCode: locationEntry.regionCode }),
    })),
  );

  locationBatchIdx++;
}
