import type { MiddlewareConfig } from "next/server";
import { routing } from "@/i18n/config";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config: MiddlewareConfig = {
  // Match only internationalized pathnames
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /sitemap/ (sitemap files)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     */
    "/((?!api/|_next/|favicon.ico|sitemap/|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};
