/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import createNextIntlPlugin from "next-intl/plugin";
import { withAxiom } from "next-axiom";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  headers: async () => {
    return [
      {
        // Cache sitemap
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=600, stale-while-revalidate=14400, stale-if-error=14400",
          },
        ],
      },
      // {
      //   // This sets the cache control header for all pages to 1 hour (3600 seconds)
      //   source: '/(.*)',
      //   headers: [
      //     {
      //       key: 'Cache-Control',
      //       value: 'public, max-age=3600, must-revalidate',
      //     },
      //   ],
      // },
    ];
  },
  redirects: async () => {
    return [
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

export default withNextIntl(withAxiom(config));
