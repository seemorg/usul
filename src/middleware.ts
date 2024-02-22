import createMiddleware from "next-intl/middleware";
import i18nConfig, { locales, defaultLocale } from "~/i18n.config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: i18nConfig.localePrefix,
  localeDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",

    "/(en|ar)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
