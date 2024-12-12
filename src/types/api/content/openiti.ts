import type { ParseResult } from "@openiti/markdown-parser";
import type { BaseContentWithPdf } from "./base";

export type OpenitiContent = BaseContentWithPdf & {
  source: "openiti";
  version: string;
  pages: ParseResult["content"];
  headings?: (ParseResult["chapters"][number] & { pageIndex?: number })[];
};
