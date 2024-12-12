import type { BaseContent } from "./base";

export type ExternalContent = BaseContent & {
  source: "external";
  url: string;
};
