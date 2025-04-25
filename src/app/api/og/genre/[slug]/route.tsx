import type { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { ArabicLogo, Logo } from "@/components/Icons";
import { getGenre } from "@/lib/api";
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

  const genre = await getGenre(slug, { locale: "en" });

  if (!genre) {
    notFound();
  }

  const calSans = await loadFileOnEdge.asArrayBuffer(fonts.calSans);

  return new ImageResponse(
    (
      <div tw="w-full h-full flex text-white bg-[#9E5048] relative items-center justify-center">
        <h1
          style={{
            fontSize: 120,
            fontFamily: "Cal Sans",
          }}
        >
          {genre.name}
        </h1>

        <div tw="absolute bottom-0 left-0 right-0 text-white flex items-center px-20 pb-8">
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
      ],
    },
  );
}
