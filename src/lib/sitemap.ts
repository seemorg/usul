import { PATH_LOCALES } from "./locale/utils";
import { config } from "./seo";

export const removeBeginningSlash = (url: string) => url.replace(/^\//, "");
export const removeTrailingSlash = (url: string) => url.replace(/\/$/, "");

export const localesWithoutDefault = PATH_LOCALES.filter(
  (locale) => locale !== "en",
);
export const relativeUrl = (relativeUrl: string) =>
  `${config.url}/${removeBeginningSlash(relativeUrl)}`;
