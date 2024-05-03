import type { AuthorDocument } from "./author";
import type { LocalizedArrayEntry, LocalizedEntry } from "./localized-entry";

export type BookDocument = {
  id: string;
  slug: string;
  authorId: string;

  primaryNames: LocalizedEntry[];
  otherNames: LocalizedArrayEntry[];

  _nameVariations: string[];
  _popularity: number;
  author: Omit<AuthorDocument, "books" | "booksCount" | "geographies">;
  versionIds: string[];
  year: number;
  genreTags: string[];
};
