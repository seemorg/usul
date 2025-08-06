export type AuthorDocument = {
  type: "author";

  id: string;
  slug: string;
  year: number;
  primaryName: string;
  secondaryName?: string;
  otherNames?: string[];
  secondaryOtherNames?: string[];

  regions: string[]; // region slugs
  geographies: string[];
  booksCount: number;
};
