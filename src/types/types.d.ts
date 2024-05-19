/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { BookVersion as _BookVersion } from "./index";

declare interface IntlMessages {
  common: typeof import("../../locales/en/common.json");
  entities: typeof import("../../locales/en/entities.json");
  home: typeof import("../../locales/en/home.json");
  reader: typeof import("../../locales/en/reader.json");
  meta: typeof import("../../locales/en/meta.json");
}

declare global {
  namespace PrismaJson {
    type BookVersion = _BookVersion;
  }
}
