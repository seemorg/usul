export type ExternalContent = {
  id: string;
  source: "external";
  url: string;
  publicationDetails?: PrismaJson.PublicationDetails;
};
