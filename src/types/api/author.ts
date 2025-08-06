import type { LocationType } from "@prisma/client";

import type { ApiRegion } from "./region";

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
  locations: {
    id: string;
    slug: string;
    name: string;
    secondaryName: string;
    type: LocationType;
    regionId: string;
    region: ApiRegion;
  }[];
}
