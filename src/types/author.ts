import type { BookDocument } from "./book";
import type { LocalizedArrayEntry, LocalizedEntry } from "./localized-entry";

export type AuthorDocument = {
  id: string;
  slug: string;
  year: number;
  primaryNames: LocalizedEntry[];
  otherNames: LocalizedArrayEntry[];
  bios: LocalizedEntry[];
  _nameVariations: string[];
  _popularity: number;
  regions: string[];
  geographies: string[];
  booksCount: number;
  books: BookDocument[];
};
