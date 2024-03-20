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
  author: Omit<AuthorDocument, "books">;
  versionIds: string[];
  year: number;
  genreTags: string[];
};
