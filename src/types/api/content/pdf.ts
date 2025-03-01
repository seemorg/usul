import type { BaseContent } from "./base";

export type PdfContent = BaseContent & {
  source: "pdf";
  url: string;
  pages?: {
    volume: number | null;
    page: number | null;
    content: string | null;
    footnotes: string | null;
    editorialNotes: string | null;
  }[];
  headings?: {
    title: string;
    level: number;
    page: {
      volume: number | null;
      page: number | null;
    };
    pageIndex: number;
  }[];
};
