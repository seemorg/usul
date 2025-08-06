export type GenreDocument = {
  type: "genre";

  id: string;
  slug: string;

  primaryName: string;
  secondaryName?: string;

  booksCount: number;
};
