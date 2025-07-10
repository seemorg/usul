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
