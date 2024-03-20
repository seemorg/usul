import type { BookDocument } from "./book";

export type AuthorDocument = {
  id: string;
  slug: string;
  year: number;
  bio: string;
  primaryArabicName?: string;
  otherArabicNames: string[];
  primaryLatinName?: string;
  otherLatinNames: string[];
  _nameVariations: string[];
  regions: string[];
  geographies: string[];
  booksCount: number;
  books: BookDocument[];
};
