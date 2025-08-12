import type { GenreDocument } from "./genre";

export type BookDocument = {
  type: "book";
  id: string;
  slug: string;
  authorId: string;

  primaryName: string;
  secondaryName?: string;
  otherNames?: string[];
  secondaryOtherNames?: string[];

  versions: PrismaJson.BookVersion[];
  coverUrl?: string;
  genreIds: string[];

  genres?: GenreDocument[];

  // these are derived from the author
  author: {
    type: "author";
    id: string;
    slug: string;
    year: number;
    primaryName: string;
    secondaryName?: string;
    otherNames?: string[];
    secondaryOtherNames?: string[];
    booksCount: number;
  };

  year: number;
  geographies: string[];
  regions: string[];
};
