import type { BaseContent } from "./base";

export type PdfContent = BaseContent & {
  source: "pdf";
  url: string;
};
