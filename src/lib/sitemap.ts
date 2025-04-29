import { PATH_LOCALES } from "./locale/utils";
import { SITE_CONFIG } from "./seo";

export const removeBeginningSlash = (url: string) => url.replace(/^\//, "");
export const removeTrailingSlash = (url: string) => url.replace(/\/$/, "");

export const localesWithoutDefault = PATH_LOCALES.filter(
  (locale) => locale !== "en",
);
export const relativeUrl = (relativeUrl: string) =>
  `${SITE_CONFIG.url}/${removeBeginningSlash(relativeUrl)}`;
