export interface ApiAuthor {
  id: string;
  slug: string;
  transliteration: string;
  year: number;
  numberOfBooks: number;
  primaryName: string;
  otherNames: string[];
  secondaryName: string;
  secondaryOtherNames: string[];
  bio: string;
}
