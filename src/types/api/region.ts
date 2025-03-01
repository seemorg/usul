export interface ApiRegion {
  id: string;
  slug: string;
  transliteration: string | null;
  name: string;
  secondaryName: string;
  currentName: string;
  overview: string;
  numberOfAuthors: number;
  numberOfBooks: number;
}
