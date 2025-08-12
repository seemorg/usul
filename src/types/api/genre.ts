import type { CollectionCardProps } from "@/components/ui/collection-card";

export interface ApiGenre {
  id: string;
  slug: string;
  numberOfBooks: number;
  name: string;
  secondaryName: string;
}

export interface ApiGenreCollection extends ApiGenre {
  color: CollectionCardProps["color"];
  pattern: CollectionCardProps["pattern"];
}
