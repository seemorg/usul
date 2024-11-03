import { env } from "@/env";
import { config } from "@/lib/seo";
import type { MetadataRoute } from "next";

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
      host: config.url,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${config.url}/sitemap.xml`,
    host: config.url,
  };
}
