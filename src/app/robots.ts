import type { MetadataRoute } from "next";
import { env } from "@/env";
import { SITE_CONFIG } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isProd = env.VERCEL_ENV === "production";

  if (!isProd) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
      host: SITE_CONFIG.url,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
