import { ArabicLogo, Logo } from "@/components/Icons";
import { loadFileOnEdge } from "@/lib/edge";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { NextApiRequest } from "next";
import { getAuthorBySlug } from "@/lib/api";
import type { AppLocale } from "~/i18n.config";
import { appLocaleToPathLocale } from "@/lib/locale/utils";

export const runtime = "edge";

const size = {
  width: 1280,
  height: 720,
};

const fonts = {
  calSans: new URL(
    "../../../../../../fonts/cal-sans/cal-sans-semibold.ttf",
    import.meta.url,
  ),
  arabic: new URL(
    "../../../../../../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-SemiBold.ttf",
    import.meta.url,
  ),
  family: new URL(
    "../../../../../../fonts/family/family-regular.ttf",
    import.meta.url,
  ),
};

// Image generation
export async function GET(
  _request: NextApiRequest,
  { params }: { params: { slug: string; locale: AppLocale } },
) {
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const pathLocale = appLocaleToPathLocale(params.locale);
  const author = await getAuthorBySlug(slug, { locale: pathLocale });

  if (!author) {
    notFound();
  }

  const trimmedOverview =
    author.bio.length > 330 ? author.bio.slice(0, 330) + "..." : author.bio;

  // Font
  const [calSans, family, arabic] = await Promise.all([
    loadFileOnEdge.asArrayBuffer(fonts.calSans),
    loadFileOnEdge.asArrayBuffer(fonts.family),
    loadFileOnEdge.asArrayBuffer(fonts.arabic),
  ]);

  const isArabic = pathLocale === "ar";

  return new ImageResponse(
    (
      <div
        tw="w-full h-full flex flex-col text-white bg-[#9E5048] pt-[50px] px-[80px]"
        style={{
          position: "relative",
          alignItems: isArabic ? "flex-end" : "flex-start",
        }}
      >
        <h1
          style={{
            fontSize: 84,
            fontFamily: isArabic ? "Arabic" : "Cal Sans",
          }}
        >
          {author.primaryName
            .split(" ")
            .reverse()
            .map((name, idx) => (
              <span key={idx}>{name}</span>
            ))}
        </h1>

        <p
          className="flex flex-col flex-wrap"
          style={{
            fontSize: isArabic ? 28 : 38,
            fontFamily: isArabic ? "Arabic" : "Family",
            textAlign: isArabic ? "right" : "left",
            marginTop: 40,
          }}
          dir={isArabic ? "rtl" : "ltr"}
        >
          {trimmedOverview
            .split(" ")
            .reverse()
            .map((word, idx) => (
              <span key={idx} className="block">
                {word}
              </span>
            ))}
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
          name: "Arabic",
          data: arabic,
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
