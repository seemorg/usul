import type { BaseContentWithPdf } from "./base";

interface TurathPage {
  text: string;
  vol: string;
  page: number;
}

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

export type TurathContent = BaseContentWithPdf & {
  source: "turath";
  version: string;
  pages: TurathPage[];
  headings?: TurathHeading[];
};
