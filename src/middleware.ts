import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "~/i18n.config";

export default createMiddleware(
  {
    locales,
    defaultLocale,
    localePrefix,
  },
  {
    localeDetection: false,
  },
);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",

    "/(en|ar|bn|fr|hi|ha|ms|ps|fa|ru|so|es|tr|ur)/:path*",

    // Match all pathnames except for
    // - if they start with `/_next` or `/_vercel`
    // - the ones containing a dot (e.g. `favicon.ico`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
