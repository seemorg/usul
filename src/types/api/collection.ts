import { CollectionCardProps } from "@/components/ui/collection-card";

export type Collection = {
  id: string;
  name: string;
  description: string;
  slug: string;
  visibility: "PUBLIC" | "UNLISTED";
  createdAt: Date;
  updatedAt: Date;
  isOwner?: boolean;
  books?: string[];
};

export type CollectionHomepage = {
  id: string;
  slug: string;
  name: string;
  pattern: CollectionCardProps["pattern"];
  color: CollectionCardProps["color"];
};
