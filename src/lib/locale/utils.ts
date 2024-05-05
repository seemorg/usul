import { useLocale } from "next-intl";
import { z } from "zod";
import {
  type AppLocale,
  pathLocaleToSupportedBcp47LocaleMap,
  localeToFullName,
  localeToDirection,
} from "~/i18n.config";

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

export const getLocaleFullName = (locale: AppLocale) => {
  return localeToFullName[locale];
};

export const getLocaleDirection = (locale: AppLocale) => {
  return localeToDirection[locale];
};

export const usePathLocale = (): PathLocale => {
  const locale = useLocale() as AppLocale;
  return supportedBcp47LocaleToPathLocale(locale);
};

export const useDirection = (): "ltr" | "rtl" => {
  const locale = useLocale() as AppLocale;
  return getLocaleDirection(locale);
};

export const localeRouterProps = {
  // locale: string as AppLocale
  locale: z.string() as z.ZodType<AppLocale, z.ZodTypeDef>,
};
