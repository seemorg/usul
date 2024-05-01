import { type Metadata, type Viewport } from "next";

export const config = {
  title: "Usul - The Research tool for Islamic Texts",
  shortTitle: "Usul",
  siteName: "Usul",
  description:
    "Read, search, and research 8,000+ Islamic and classical texts in a few clicks",
  themeColor: "#AA4A44",
  locale: "en_US",
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
}: {
  title?: string;
  description?: string;
  all?: boolean;
  concatTitle?: boolean;
} = {}): Metadata => {
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

    return {
      ...newTitle,
      ...newDescription,
      openGraph: {
        ...newTitle,
        ...newDescription,
      },
      twitter: {
        ...newTitle,
        ...newDescription,
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
      locale: config.locale,
      url: "/",
      title,
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
