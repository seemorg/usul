/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import { NextConfig } from "next";
import { env } from "@/env";
import createBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const config: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  eslint: { ignoreDuringBuilds: true },
  headers: async () => {
    const headers: Awaited<ReturnType<NonNullable<NextConfig["headers"]>>> = [
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
    ];

    // disable indexing on non-production environments
    if (env.VERCEL_ENV !== "production") {
      headers.push({
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      });
    }

    return headers;
  },
  redirects: async () => {
    return [
      {
        // Redirects from /en to / (for old Google-indexed URLs)
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        // Redirects from /en/:path* to /:path* (for old Google-indexed URLs)
        source: "/en/:path*",
        destination: "/:path*",
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

const plugins = [
  createBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  }),
  createMDX({
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  }),
  createNextIntlPlugin("./src/i18n/request.ts"),
];

export default plugins.reduce((acc, plugin) => plugin(acc), config);
