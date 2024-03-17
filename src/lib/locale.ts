import type { AppLocale } from "~/i18n.config";

const localeToFullName: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
};

export const getLocaleFullName = (locale: AppLocale) => {
  return localeToFullName[locale];
};

export const getLocaleDirection = (locale: AppLocale) => {
  return locale === "ar" ? "rtl" : "ltr";
};
