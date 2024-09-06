import type { LocalizedArrayEntry, LocalizedEntry } from "./localized-entry";

export type AuthorDocument = {
  id: string;
  slug: string;
  year: number;
  transliteration?: string;
  primaryNames: LocalizedEntry[];
  otherNames: LocalizedArrayEntry[];
  bios: LocalizedEntry[];
  _nameVariations: string[];
  _popularity: number;
  regions: string[]; // region slugs
  geographies: string[];
  booksCount: number;
};
