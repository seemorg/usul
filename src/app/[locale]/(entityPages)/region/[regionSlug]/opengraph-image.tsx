import { loadFileOnEdge } from "@/lib/edge";
import { findRegionBySlug } from "@/server/services/regions";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1280,
  height: 720,
};

export const contentType = "image/png";

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
export default async function Image({
  params: { regionSlug },
}: {
  params: {
    regionSlug: string;
  };
}) {
  const region = await findRegionBySlug(regionSlug);

  if (!region) {
    notFound();
  }

  // Font
  const [calSans, family] = await Promise.all([
    loadFileOnEdge.asArrayBuffer(fonts.calSans),
    loadFileOnEdge.asArrayBuffer(fonts.family),
  ]);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div tw="w-full h-full flex flex-col text-white bg-[#9E5048] pt-[100px] px-[100px]">
        <h1
          style={{
            fontSize: 84,
            fontFamily: "Cal Sans",
          }}
        >
          {region.region.name}
        </h1>

        <p
          style={{
            fontSize: 38,
            fontFamily: "Family",
            marginTop: 50,
          }}
        >
          {region.region.overview}
        </p>
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
