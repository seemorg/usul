/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  redirects: async () => {
    return [
      {
        // Redirects from /ar/:path* to /ar-SA/:path*
        source: "/ar/:path*",
        destination: "/ar-SA/:path*",
        permanent: true,
      },
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
