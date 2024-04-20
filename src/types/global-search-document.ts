import type { AuthorDocument } from "./author";

export type GlobalSearchDocument = {
  id: string;
  slug: string;
  type: "author" | "book" | "genre" | "region";
  primaryArabicName?: string;
  otherArabicNames?: string[];
  primaryLatinName?: string;
  otherLatinNames?: string[];
  _nameVariations?: string[];
  _popularity?: number;
  author?: Omit<AuthorDocument, "books" | "booksCount" | "geographies">;
  year?: number;
  booksCount?: number;
};
