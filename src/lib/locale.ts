import type { AppLocale } from "~/i18n.config";

const localeToFullName: Record<AppLocale, string> = {
  en: "English",
  "ar-SA": "العربية",
};

export const getLocaleFullName = (locale: AppLocale) => {
  return localeToFullName[locale];
};

export const getLocaleDirection = (locale: AppLocale) => {
  if (locale === "ar-SA") {
    return "rtl";
  }

  return "ltr";
};
