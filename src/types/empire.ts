// import type { LocalizedEntry } from "./localized-entry";

export type EmpireDocument = {
  type: "empire";

  id: string;
  slug: string;

  primaryName: string;
  secondaryName?: string;

  hijriStartYear?: number;
  hijriEndYear?: number;

  booksCount: number;
  authorsCount: number;
  // _popularity: number;
};
