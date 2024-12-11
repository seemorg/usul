interface TurathPage {
  text: string;
  vol: string;
  page: number;
}

type TurathPdf =
  | {
      fullBookUrl: string;
      sizeInMb?: string;
    }
  | {
      volume: string;
      url: string;
    }[]
  | null;

type TurathHeading = {
  page:
    | {
        vol: string;
        page: number;
      }
    | undefined;
  title: string;
  level: number;
  pageIndex?: number | undefined;
};

export type TurathContent = {
  id: string;
  version: string;
  source: "turath";
  pages: TurathPage[];
  pdf?: TurathPdf;
  publicationDetails?: PrismaJson.PublicationDetails;
  headings?: TurathHeading[];
  pdfUrl?: string;
};
