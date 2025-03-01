import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "en-US", // english
    "ar-SA", // arabic
    "bn-BD", // bengali
    "fr-FR", // french
    "hi-IN", // hindi
    "ha-NG", // hausa
    "ms-MY", // malay
    "ps-AF", // pashto
    "fa-IR", // persian
    "ru-RU", // russian
    "so-SO", // somali
    "es-ES", // spanish
    "tr-TR", // turkish
    "ur-PK", // urdu
  ],
  localePrefix: {
    mode: "as-needed" as const,
    prefixes: {
      "en-US": "/en",
      "ar-SA": "/ar",
      "bn-BD": "/bn",
      "fr-FR": "/fr",
      "hi-IN": "/hi",
      "ha-NG": "/ha",
      "ms-MY": "/ms",
      "ps-AF": "/ps",
      "fa-IR": "/fa",
      "ru-RU": "/ru",
      "so-SO": "/so",
      "es-ES": "/es",
      "tr-TR": "/tr",
      "ur-PK": "/ur",
    },
  },
  defaultLocale: "en-US",
});

export const pathLocaleToSupportedBcp47LocaleMap = {
  en: "en-US",
  ar: "ar-SA",
  bn: "bn-BD",
  fr: "fr-FR",
  hi: "hi-IN",
  ha: "ha-NG",
  ms: "ms-MY",
  ps: "ps-AF",
  fa: "fa-IR",
  ru: "ru-RU",
  so: "so-SO",
  es: "es-ES",
  tr: "tr-TR",
  ur: "ur-PK",
} as const;

const config = {
  namespaces: [
    "common",
    "home",
    "entities",
    "reader",
    "meta",
    "about",
    "team",
    "donate",
    "collections",
  ] as const,
  namespacedRoutes: {
    "*": ["common", "entities", "meta", "reader"],
    "/": ["home", "collections"],
    "/t/*": ["reader"],
    "/about": ["about"],
    "/team": ["team"],
    "/donate": ["donate"],
    "/collections/*": ["collections"],
    // "/chat/*": ["reader"],
  },
};

export default config;

export type AppLocale = (typeof routing)["locales"][number];

export const localeToFullName: Record<AppLocale, string> = {
  "en-US": "English",
  "ar-SA": "العربية",
  "bn-BD": "বাংলা",
  "fr-FR": "Français",
  "hi-IN": "हिन्दी",
  "ha-NG": "Hausa",
  "ms-MY": "Bahasa Melayu",
  "ps-AF": "پښتو",
  "fa-IR": "فارسی",
  "ru-RU": "русский",
  "so-SO": "Soomaali",
  "es-ES": "Español",
  "tr-TR": "Türkçe",
  "ur-PK": "اردو",
};

export const localeToDirection: Record<AppLocale, "ltr" | "rtl"> = {
  "en-US": "ltr",
  "ar-SA": "rtl",
  "bn-BD": "ltr",
  "fr-FR": "ltr",
  "hi-IN": "ltr",
  "ha-NG": "ltr",
  "ms-MY": "ltr",
  "ps-AF": "ltr",
  "fa-IR": "rtl",
  "ru-RU": "ltr",
  "so-SO": "ltr",
  "es-ES": "ltr",
  "tr-TR": "ltr",
  "ur-PK": "rtl",
};
