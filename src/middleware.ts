import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import i18nConfig, { locales, defaultLocale } from "~/i18n.config";
import {
  pathLocaleToSupportedBcp47Locale,
  supportedBcp47LocaleToPathLocale,
} from "./lib/locale/utils";

const localeMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: i18nConfig.localePrefix,
  localeDetection: false,
});

export default function middleware(request: NextRequest) {
  let modifiedRequest: NextRequest = request;

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
    mappedURL.search = request.nextUrl.search;
    modifiedRequest = new NextRequest(mappedURL, request as Request);
  } else {
    if (pathLocale) {
      try {
        const newPathLocale = supportedBcp47LocaleToPathLocale(
          pathLocale as any,
        );

        // redirect from non-supported locale to supported locale
        const mappedURL = new URL(
          request.nextUrl.pathname.replace(
            new RegExp(`^/${pathLocale}`),
            `/${newPathLocale}`,
          ),
          request.url,
        );
        mappedURL.search = request.nextUrl.search;

        return NextResponse.redirect(mappedURL, {
          status: 302,
        }) as NextResponse<any>;
      } catch (e) {}
    }
  }

  return localeMiddleware(modifiedRequest);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",

    "/(en|ar|bn|fr|hi|ha|ms|ps|fa|ru|so|es|tr|ur)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
