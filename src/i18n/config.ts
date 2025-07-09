import type { Locale } from "next-intl";
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
  localeDetection: false,
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
    "chat",
    "home",
    "entities",
    "reader",
    "meta",
    "about",
    "team",
    "donate",
    "collections",
    "login",
    "profile",
  ] as const,
  namespacedRoutes: {
    "*": ["common", "entities", "meta", "reader"],
    "/": ["home", "collections"],
    "/t/*": ["reader"],
    "/about": ["about"],
    "/team": ["team"],
    "/donate": ["donate"],
    "/collections/*": ["collections"],
    "/login": ["login"],
    "/profile": ["profile"],
    "/chat": ["chat"],
    "/chat/*": ["chat"],
  },
};

export default config;

export const localeToFullName: Record<Locale, string> = {
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

export const localeToEnglishName: Record<Locale, string> = {
  "en-US": "English",
  "ar-SA": "Arabic",
  "bn-BD": "Bengali",
  "fr-FR": "French",
  "hi-IN": "Hindi",
  "ha-NG": "Hausa",
  "ms-MY": "Malay",
  "ps-AF": "Pashto",
  "fa-IR": "Persian",
  "ru-RU": "Russian",
  "so-SO": "Somali",
  "es-ES": "Spanish",
  "tr-TR": "Turkish",
  "ur-PK": "Urdu",
};

export const localeToDirection: Record<Locale, "ltr" | "rtl"> = {
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
