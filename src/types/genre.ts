export type GenreDocument = {
  type: "genre";

  id: string;
  slug: string;

  primaryName: string;
  secondaryName?: string;

  booksCount: number;
};

export type GenreNode = {
  id: string;
  slug: string;
  primaryName: string;
  secondaryName: string;
  numberOfBooks: number;
  children?: GenreNode[];
};