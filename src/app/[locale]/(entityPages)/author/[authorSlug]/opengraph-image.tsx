import { ArabicLogo, Logo } from "@/components/Icons";
import { loadFileOnEdge } from "@/lib/edge";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { findAuthorBySlug } from "@/server/services/authors";

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

export async function generateImageMetadata({
  params: { authorSlug },
}: {
  params: { authorSlug: string };
}) {
  const author = await findAuthorBySlug(authorSlug);
  const name = author?.primaryLatinName ?? author?.primaryArabicName;
  if (!name) return [];

  return [
    {
      id: "main",
      alt: name,
      contentType: "image/png",
      size,
    },
  ];
}

// Image generation
export default async function Image({
  params: { authorSlug },
}: {
  params: { authorSlug: string };
}) {
  const author = await findAuthorBySlug(authorSlug);

  if (!author) {
    notFound();
  }

  const name = author?.primaryLatinName ?? author?.primaryArabicName;

  // Font
  const [calSans, family] = await Promise.all([
    loadFileOnEdge.asArrayBuffer(fonts.calSans),
    loadFileOnEdge.asArrayBuffer(fonts.family),
  ]);

  const overview = author.bio ?? "";
  const trimmedOverview =
    overview.length > 330 ? overview.slice(0, 330) + "..." : overview;

  return new ImageResponse(
    (
      <div
        tw="w-full h-full flex flex-col text-white bg-[#9E5048] pt-[50px] px-[80px]"
        style={{
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: 84,
            fontFamily: "Cal Sans",
          }}
        >
          {name}
        </h1>

        <p
          style={{
            fontSize: 38,
            fontFamily: "Family",
            marginTop: 40,
          }}
        >
          {trimmedOverview}
        </p>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 80,
            display: "flex",
            alignItems: "flex-end",
            gap: 20,
          }}
        >
          {/* w:26 h:10 */}
          <Logo style={{ height: 40, width: 104 }} />

          {/* w:65 h:37 */}
          <ArabicLogo style={{ height: 50, width: 88 }} />
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
