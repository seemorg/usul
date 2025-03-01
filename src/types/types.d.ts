/* eslint-disable @typescript-eslint/consistent-type-imports */

declare interface IntlMessages {
  common: typeof import("../../locales/en/common.json");
  entities: typeof import("../../locales/en/entities.json");
  home: typeof import("../../locales/en/home.json");
  reader: typeof import("../../locales/en/reader.json");
  meta: typeof import("../../locales/en/meta.json");
  about: typeof import("../../locales/en/about.json");
  team: typeof import("../../locales/en/team.json");
  donate: typeof import("../../locales/en/donate.json");
  collections: typeof import("../../locales/en/collections.json");
}

declare module "*.svg" {
  import { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  const content: any;
  export default content;
}
