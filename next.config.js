/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const env = await import("./src/env.js");

import createNextIntlPlugin from "next-intl/plugin";
import { withAxiom } from "next-axiom";
import createMDX from "@next/mdx";
import createBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  headers: async () => {
    /** @type {Awaited<ReturnType<NonNullable<import("next").NextConfig["headers"]>>>} */
    const headers = [
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
    if (env.env.VERCEL_ENV !== "production") {
      headers.push({
        source: "*",
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

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const plugins = [withBundleAnalyzer, withMDX, withNextIntl, withAxiom];

export default plugins.reduce((acc, plugin) => plugin(acc), config);
