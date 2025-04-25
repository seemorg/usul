import type { Locale } from "next-intl";
import {
  localeToDirection,
  localeToFullName,
  pathLocaleToSupportedBcp47LocaleMap,
} from "@/i18n/config";
import { useLocale } from "next-intl";

export const PATH_LOCALES = Object.keys(
  pathLocaleToSupportedBcp47LocaleMap,
) as (keyof typeof pathLocaleToSupportedBcp47LocaleMap)[];

export type PathLocale = (typeof PATH_LOCALES)[number];

export const pathLocaleToAppLocale = (
  pathLocale: string | PathLocale,
): Locale | undefined =>
  pathLocaleToSupportedBcp47LocaleMap[pathLocale.toLowerCase() as PathLocale];

export const appLocaleToPathLocale = (bcp47Locale: Locale): PathLocale => {
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

export const getLocaleFullName = (locale: Locale) => {
  return localeToFullName[locale];
};

export const getLocaleDirection = (locale: Locale) => {
  return localeToDirection[locale];
};

export const usePathLocale = (): PathLocale => {
  const locale = useLocale();
  return appLocaleToPathLocale(locale);
};

export const useDirection = (): "ltr" | "rtl" => {
  const locale = useLocale();
  return getLocaleDirection(locale);
};
