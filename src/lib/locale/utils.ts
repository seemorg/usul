import type { AppLocale } from "~/i18n.config";

// Map locales in the path to supported BCP-47 locale tags.  Ideally we'll
// eventually migrate to this just being a passthrough, but we have a lot of
// tags that are used in the URL that aren't BCP-47 compliant so we need this to
// map between them.
export const pathLocaleToSupportedBcp47LocaleMap = {
  en: "en-US",
  ar: "ar-SA",
} as const satisfies Record<string, AppLocale>;

export const PATH_LOCALES = Object.keys(
  pathLocaleToSupportedBcp47LocaleMap,
) as (keyof typeof pathLocaleToSupportedBcp47LocaleMap)[];

export type PathLocale = (typeof PATH_LOCALES)[number];

export const pathLocaleToSupportedBcp47Locale = (
  pathLocale: string | PathLocale,
): AppLocale | undefined =>
  pathLocaleToSupportedBcp47LocaleMap[pathLocale.toLowerCase() as PathLocale];

export const supportedBcp47LocaleToPathLocale = (
  bcp47Locale: AppLocale,
): PathLocale => {
  const match = Object.entries(pathLocaleToSupportedBcp47LocaleMap).find(
    (entry) => entry[1] === bcp47Locale,
  );

  if (match) {
    return match[0] as PathLocale;
  } else {
    throw new Error(
      `Expected to find ${bcp47Locale} in path locale to bcp47locale map but no such entry was found!`,
    );
  }
};
