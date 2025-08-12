import type { AuthorDocument } from "./author";

export type GlobalSearchDocument = {
  id: string;
  slug: string;
  type: "author" | "book" | "genre" | "region";

  primaryName: string;
  secondaryName?: string;
  otherNames?: string[];

  author?: Omit<AuthorDocument, "books" | "booksCount" | "geographies">;
  year?: number;
  booksCount?: number;
};
