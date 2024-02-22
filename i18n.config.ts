export const locales = ["en", "ar"] as const;
export const defaultLocale = "en" as const;

const config = {
  namespaces: ["common"] as const,
  localePrefix: "as-needed" as const,
  namespacedRoutes: {
    "*": ["common"],
    "/": ["home"],
  },
};

export default config;

export type AppLocale = (typeof locales)[number];
