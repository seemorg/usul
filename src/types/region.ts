// import type { LocalizedEntry } from "./localized-entry";

export type RegionDocument = {
  type: "region";

  id: string;
  slug: string;

  primaryName: string;
  secondaryName?: string;
  currentName?: string;
  // otherNames?: string[];
  // names: LocalizedEntry[];
  // currentNames: LocalizedEntry[];

  booksCount: number;
  authorsCount: number;
  // _popularity: number;

  // subLocations: LocalizedEntry[];
  subLocations?: string[];
  subLocationsCount: number;
};
