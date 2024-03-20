import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import i18nConfig, { locales, defaultLocale } from "~/i18n.config";
import { pathLocaleToSupportedBcp47Locale } from "./lib/locale/utils";

const localeMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: i18nConfig.localePrefix,
  localeDetection: true,
});

const handlePathLocale = (request: NextRequest): NextRequest => {
  const pathLocale = request.nextUrl.pathname.split("/")[1];
  const bcp47Locale = pathLocaleToSupportedBcp47Locale(pathLocale ?? "");
  if (pathLocale && bcp47Locale) {
    const mappedURL = new URL(
      request.nextUrl.pathname.replace(
        new RegExp(`^/${pathLocale}`),
        `/${bcp47Locale}`,
      ),
      request.nextUrl.origin,
    );
    return new NextRequest(mappedURL, request as Request);
  } else {
    return request;
  }
};

export default function middleware(request: NextRequest) {
  return localeMiddleware(handlePathLocale(request));
}

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
