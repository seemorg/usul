export type PdfContent = {
  id: string;
  source: "pdf";
  url: string;
  publicationDetails?: PrismaJson.PublicationDetails;
};
