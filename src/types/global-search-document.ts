import type { AuthorDocument } from "./author";

// import type { LocalizedArrayEntry, LocalizedEntry } from "./localized-entry";

export type GlobalSearchDocument = {
  id: string;
  slug: string;
  type: "author" | "book" | "genre" | "region";

  transliteration?: string;
  primaryName: string;
  secondaryName?: string;
  otherNames?: string[];

  // primaryNames: LocalizedEntry[];
  // otherNames: LocalizedArrayEntry[];

  // _nameVariations?: string[];
  // _popularity?: number;
  author?: Omit<AuthorDocument, "books" | "booksCount" | "geographies">;
  year?: number;
  booksCount?: number;
};
