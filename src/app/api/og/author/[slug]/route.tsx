import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { ArabicLogo, Logo } from "@/components/Icons";
import { getAuthorBySlug } from "@/lib/api";
import { loadFileOnEdge } from "@/lib/edge";

export const runtime = "edge";

const size = {
  width: 1280,
  height: 720,
};

const fonts = {
  calSans: new URL(
    "../../../../../fonts/cal-sans/cal-sans-semibold.ttf",
    import.meta.url,
  ),
  family: new URL(
    "../../../../../fonts/family/family-regular.ttf",
    import.meta.url,
  ),
};

// Image generation
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const author = await getAuthorBySlug(slug, { locale: "en" });

  if (!author) {
    notFound();
  }

  const trimmedOverview =
    author.bio.length > 330 ? author.bio.slice(0, 330) + "..." : author.bio;

  // Font
  const [calSans, family] = await Promise.all([
    loadFileOnEdge.asArrayBuffer(fonts.calSans),
    loadFileOnEdge.asArrayBuffer(fonts.family),
  ]);

  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col text-white bg-[#9E5048] pt-[50px] px-20 relative items-start">
        <h1
          style={{
            fontSize: 84,
            fontFamily: "Cal Sans",
          }}
        >
          {author.primaryName}
        </h1>

        <p
          style={{
            fontSize: 38,
            fontFamily: "Family",
            textAlign: "left",
            marginTop: 40,
          }}
        >
          {trimmedOverview}
        </p>

        <div tw="absolute bottom-0 left-0 right-0 text-white flex items-center px-20 py-8">
          {/* w:26 h:10 */}
          <Logo style={{ height: 40, width: 104 }} />

          {/* w:65 h:37 */}
          <ArabicLogo style={{ height: 50, width: 88, marginLeft: 20 }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cal Sans",
          data: calSans,
          weight: 600,
          style: "normal",
        },

        {
          name: "Family",
          data: family,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
