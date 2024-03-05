import type { Place } from "@/types/places";
import locations from "../data/distinct-locations.json";
import regions from "../data/regions.json";
import slugify from "slugify";
import fs from "fs";

const URL =
  "https://raw.githubusercontent.com/althurayya/althurayya.github.io/master/master/places.json";

const { features: mappings } = (await (await fetch(URL)).json()) as {
  features: Place[];
};

const uriToRegionData = mappings.reduce(
  (acc, place) => {
    acc[place.properties.cornuData.cornu_URI] = {
      code: place.properties.cornuData.region_code,
      slug: slugify(place.properties.cornuData.region_code, { lower: true }),
    };
    return acc;
  },
  {} as Record<string, { code: string; slug: string }>,
);

const regionUriToCode = Object.keys(regions).reduce(
  (acc, uri) => {
    acc[uri.toLowerCase()] = (regions as any)[uri]!.region_code;
    return acc;
  },
  {} as Record<string, string>,
);

const newLocationsMap = locations.map((location) => {
  const [, uri = ""] = location.split("@");

  if (!uri?.includes("_RE")) {
    const region = uriToRegionData[uri] ?? null;

    return {
      location,
      region,
    };
  }

  const [uriWithoutRE = ""] = uri.toLowerCase().split("_re");
  const regionCode = regionUriToCode[`${uriWithoutRE}_re`] ?? null;

  const region = regionCode
    ? Object.values(uriToRegionData).find((r) => r.code === regionCode)
    : null;

  return {
    location,
    region,
  };
});

fs.writeFileSync(
  "./data/distinct-locations-with-regions.json",
  JSON.stringify(newLocationsMap, null, 2),
);

const distinctRegions = newLocationsMap.reduce(
  (acc, { region }) => {
    if (region) {
      acc[region.slug] = region;
    }
    return acc;
  },
  {} as Record<string, { code: string; slug: string }>,
);

fs.writeFileSync(
  "./data/distinct-regions.json",
  JSON.stringify(distinctRegions, null, 2),
);
