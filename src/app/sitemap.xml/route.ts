import { relativeUrl } from "@/lib/sitemap";
import { generateSitemaps } from "../sitemap/sitemap";
import { env } from "@/env";

export const revalidate = 60 * 60 * 24 * 7; // cache for 7 days

function getLoc(id: number) {
  return relativeUrl(`/sitemap/${id}.xml`);
}

function getLastMod() {
  return new Date().toISOString();
}

function getSitemap(id: number) {
  return `<sitemap><loc>${getLoc(id)}</loc><lastmod>${getLastMod()}</lastmod></sitemap>`;
}

function getSitemaps(ids: { id: number }[]) {
  return ids.map(({ id }) => getSitemap(id)).join("");
}

export async function GET() {
  const sitemapIds = generateSitemaps();

  // We only want to generate the sitemap.xml file in production
  const isProd = env.VERCEL_ENV === "production";
  if (!isProd) return Response.json({ error: "Not found" }, { status: 404 });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${getSitemaps(sitemapIds as any)}
    </sitemapindex>
  `;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
