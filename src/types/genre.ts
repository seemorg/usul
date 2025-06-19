// import type { LocalizedEntry } from "./localized-entry";

export type GenreDocument = {
  type: "genre";

  id: string;
  slug: string;
  transliteration?: string;
  primaryName: string;
  secondaryName?: string;

  // nameTranslations: LocalizedEntry[];
  // _popularity: number;

  booksCount: number;
};
