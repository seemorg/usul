import type { AuthorDocument } from "./author";

export type BookDocument = {
  id: string;
  slug: string;
  authorId: string;
  primaryArabicName: string;
  otherArabicNames: string[];
  primaryLatinName: string;
  otherLatinNames: string[];
  _nameVariations: string[];
  _popularity: number;
  author: Omit<AuthorDocument, "books" | "booksCount" | "geographies">;
  versionIds: string[];
  year: number;
  genreTags: string[];
};
