import { relativeUrl } from "@/lib/sitemap";

const sitemaps = [1, 2, 3];

export const dynamic = "force-static";

export async function GET() {
  // const isProd = env.VERCEL_ENV === "production";
  // if (!isProd) {
  //   return new Response("Not found", { status: 404 });
  // }

  const lastModified = new Date();
  const result = `
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `
<sitemap>
  <loc>
  ${relativeUrl(`/sitemap/${sitemap}.xml`)}
  </loc>

  <lastmod>${lastModified.toISOString()}</lastmod>
</sitemap>
`,
  )
  .join("\n")}
</sitemapindex>
  `;

  return new Response(result, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
