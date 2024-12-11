import type { ParseResult } from "@openiti/markdown-parser";

export type OpenitiContent = {
  id: string;
  version: string;
  source: "openiti";
  pages: ParseResult["content"];
  publicationDetails?: PrismaJson.PublicationDetails;
  headings?: (ParseResult["chapters"][number] & { pageIndex?: number })[];
  pdfUrl?: string;
};
