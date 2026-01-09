export interface ApiAuthor {
  id: string;
  slug: string;
  year: number;
  numberOfBooks: number;
  primaryName: string;
  otherNames: string[];
  secondaryName: string;
  secondaryOtherNames: string[];
  bio: string;
  regions: {
    id: string;
    slug: string;
    name: string;
    secondaryName: string;
  }[];
  empires: {
    id: string;
    slug: string;
    name: string;
    secondaryName: string;
  }[];
}
