import type { LocalizedArrayEntry, LocalizedEntry } from "./localized-entry";

export type BookDocument = {
  id: string;
  slug: string;
  authorId: string;
  transliteration?: string;
  primaryNames: LocalizedEntry[];
  otherNames: LocalizedArrayEntry[];

  _nameVariations: string[];
  _popularity: number;

  versions: PrismaJson.BookVersion[];
  coverUrl?: string;
  genreIds: string[];
  // these are derived from the author
  author: {
    id: string;
    slug: string;
    transliteration?: string;
    year: number;
    primaryNames: LocalizedEntry[];
    otherNames: LocalizedArrayEntry[];
    _nameVariations: string[];
    booksCount: number;
  };

  year: number;
  geographies: string[];
  regions: string[];
};
