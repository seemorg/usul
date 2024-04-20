export type RegionDocument = {
  id: string;
  slug: string;
  name: string;
  currentName: string;
  arabicName: string;

  booksCount: number;
  authorsCount: number;
  _popularity: number;

  subLocations: string[];
  subLocationsCount: number;
};
