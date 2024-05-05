import { PATH_LOCALES, supportedBcp47LocaleToPathLocale } from "./locale/utils";
import { type Metadata, type Viewport } from "next";
import { relativeUrl } from "./sitemap";
import type { AppLocale } from "~/i18n.config";

export const config = {
  title: "Usul - The Research tool for Islamic Texts",
  shortTitle: "Usul",
  siteName: "Usul",
  description:
    "Read, search, and research 8,000+ Islamic and classical texts in a few clicks",
  themeColor: "#AA4A44",
  image: {
    url: "/cover.png",
    width: 1500,
    height: 600,
    alt: "Usul Cover",
  },
  url: "https://usul.ai",
};

export const getMetadata = ({
  title: baseTitle,
  description = config.description,
  all = false,
  concatTitle = true,
  pagePath,
  hasImage = false,
  keywords,
  authors,
  locale,
}: {
  title?: string;
  description?: string;
  all?: boolean;
  concatTitle?: boolean;
  pagePath?: string;
  hasImage?: boolean;
  keywords?: string[];
  authors?: Metadata["authors"];
  locale: AppLocale;
}): Metadata => {
  const pathLocale = supportedBcp47LocaleToPathLocale(locale);

  const images = [config.image];

  const title = baseTitle
    ? concatTitle
      ? `${baseTitle} | ${config.shortTitle}`
      : baseTitle
    : config.title;

  if (!all) {
    const newTitle = title !== config.title ? { title } : {};
    const newDescription =
      description !== config.description ? { description } : {};
    const newImages = hasImage ? {} : { images };

    const canonical =
      pagePath && pathLocale
        ? pathLocale === "en"
          ? pagePath
          : `/${pathLocale}${pagePath}`
        : undefined;

    return {
      ...newTitle,
      ...newDescription,
      keywords,
      authors,
      openGraph: {
        type: "website",
        siteName: config.siteName,
        url: "/",
        locale,
        ...newTitle,
        ...newDescription,
        ...newImages,
      },
      twitter: {
        card: "summary_large_image",
        ...newTitle,
        ...newDescription,
        ...newImages,
      },
      alternates: {
        canonical,
        languages: pagePath
          ? {
              ...PATH_LOCALES.reduce(
                (acc, locale) => {
                  acc[locale] = relativeUrl(
                    `/${locale}${pagePath === "/" ? "" : pagePath}`,
                  );
                  return acc;
                },
                {} as Record<string, string>,
              ),
              "x-default": relativeUrl(pagePath),
            }
          : {},
      },
    };
  }

  return {
    title,
    description,
    metadataBase: new URL(config.url),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
      type: "website",
      siteName: config.siteName,
      url: "/",
      title,
      locale,
      description,
      images,
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
};

export const getViewport = (): Viewport => {
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: config.themeColor,
  };
};
