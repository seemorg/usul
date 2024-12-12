export type BaseContent = {
  id: string;
  publicationDetails?: PrismaJson.PublicationDetails;
};

export type BaseContentWithPdf = BaseContent & {
  pdfUrl?: string;
};
