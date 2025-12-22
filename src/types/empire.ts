// import type { LocalizedEntry } from "./localized-entry";

export type EmpireDocument = {
  type: "empire";

  id: string;
  slug: string;

  primaryName: string;
  secondaryName?: string;
  // otherNames?: string[];
  // names: LocalizedEntry[];
  // currentNames: LocalizedEntry[];

  booksCount: number;
  authorsCount: number;
  // _popularity: number;
};
