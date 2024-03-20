export const locales = ["en-US", "ar-SA"] as const;
export const defaultLocale = "en-US" as const;

const config = {
  namespaces: ["common", "home", "entities", "reader"] as const,
  localePrefix: "as-needed" as const,
  namespacedRoutes: {
    "*": ["common", "entities"],
    "/": ["home"],
    "/t/*": ["reader"],
  },
};

export default config;

export type AppLocale = (typeof locales)[number];
