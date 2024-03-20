/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import createNextIntlPlugin from "next-intl/plugin";
import { supportedBcp47LocaleToPathLocale } from "@/lib/locale/utils.js";
import { locales } from "./i18n.config.js";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  redirects: async () => {
    const localesPaths = locales.map((locale) => {
      const pathLocale = supportedBcp47LocaleToPathLocale(locale);

      return {
        source: `/${locale}/:path*`,
        destination: `/${pathLocale}/:path*`,
        permanent: true,
      };
    });

    return [
      ...localesPaths,
      {
        // Redirects from /regions/:region to /region/:region
        source: "/regions/:region",
        destination: "/region/:region",
        permanent: true,
      },
      {
        // Redirects from /authors/:authorSlug to /author/:authorSlug
        source: "/authors/:authorSlug",
        destination: "/author/:authorSlug",
        permanent: true,
      },
      {
        // Redirects from /centuries/:century to /century/:century
        source: "/centuries/:century",
        destination: "/century/:century",
        permanent: true,
      },
      {
        // Redirects from /genres/:genreSlug to /genre/:genreSlug
        source: "/genres/:genreSlug",
        destination: "/genre/:genreSlug",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(config);
