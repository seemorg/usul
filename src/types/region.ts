import type { LocalizedEntry } from "./localized-entry";

export type RegionDocument = {
  id: string;
  slug: string;

  names: LocalizedEntry[];
  currentNames: LocalizedEntry[];

  booksCount: number;
  authorsCount: number;
  _popularity: number;

  subLocations: string[];
  subLocationsCount: number;
};
