import { PATH_LOCALES, appLocaleToPathLocale } from "./locale/utils";
import { type Metadata, type Viewport } from "next";
import { relativeUrl } from "./sitemap";
import type { AppLocale } from "~/i18n.config";
import { getTranslations } from "next-intl/server";

export const config = {
  themeColor: "#AA4A44",
  image: {
    url: "/cover.png",
    width: 1500,
    height: 600,
    alt: "Usul Cover",
  },
  url: "https://usul.ai",
  feedbackEmail: "feedback@usul.ai",
  contactEmail: "contact@usul.ai",
};

export const getMetadata = async ({
  title: baseTitle,
  description,
  all = false,
  concatTitle = true,
  pagePath,
  image,
  keywords,
  authors,
  locale,
}: {
  title?: string;
  description?: string;
  all?: boolean;
  concatTitle?: boolean;
  pagePath?: string;
  image?: { url: string; width: number; height: number; alt?: string };
  keywords?: string[];
  authors?: Metadata["authors"];
  locale?: AppLocale;
} = {}): Promise<Metadata> => {
  const t = await getTranslations("meta.global");

  const pathLocale = locale ? appLocaleToPathLocale(locale) : undefined;

  const images = [config.image];

  const siteName = t("usul");
  const defaultTitle = `${siteName} - ${t("slogan")}`;
  const defaultDescription = t("description");

  const title = baseTitle
    ? concatTitle
      ? `${baseTitle} | ${siteName}`
      : baseTitle
    : defaultTitle;

  if (!all) {
    const newTitle = title !== defaultTitle ? { title } : {};
    const newDescription =
      description && description !== defaultDescription ? { description } : {};
    const newImages = image ? { images: [image] } : { images };

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
        siteName,
        url: "/",
        locale: locale ?? "en_US",
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
    description: description ?? defaultDescription,
    metadataBase: new URL(config.url),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
      type: "website",
      siteName,
      url: "/",
      title,
      locale: locale ?? "en_US",
      description: description ?? defaultDescription,
      images,
    },
    alternates: {
      canonical: "/",
      languages: {
        ...PATH_LOCALES.reduce(
          (acc, locale) => {
            acc[locale] = relativeUrl(`/${locale}`);
            return acc;
          },
          {} as Record<string, string>,
        ),
        "x-default": relativeUrl("/"),
      },
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
      description: description ?? defaultDescription,
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
