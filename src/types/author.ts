// import type { LocalizedArrayEntry, LocalizedEntry } from "./localized-entry";

export type AuthorDocument = {
  type: "author";

  id: string;
  slug: string;
  year: number;
  transliteration?: string;
  primaryName: string;
  secondaryName?: string;
  otherNames?: string[];
  secondaryOtherNames?: string[];

  // primaryNames: LocalizedEntry[];
  // otherNames: LocalizedArrayEntry[];
  // bios: LocalizedEntry[];
  // _nameVariations: string[];
  // _popularity: number;

  regions: string[]; // region slugs
  geographies: string[];
  booksCount: number;
};
