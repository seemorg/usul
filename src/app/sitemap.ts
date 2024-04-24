import { localesWithoutDefault, relativeUrl } from "@/lib/sitemap";
import { navigation } from "@/lib/urls";
import type { MetadataRoute } from "next";

const rootEntityPages = [
  navigation.books.all(),
  navigation.authors.all(),
  navigation.centuries.all(),
  navigation.regions.all(),
  navigation.genres.all(),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // home page
      url: relativeUrl("/"),
      lastModified: new Date(),
      alternates: {
        languages: localesWithoutDefault.reduce(
          (acc, locale) => {
            acc[locale] = relativeUrl(`/${locale}`);
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    },
    // root entities
    ...rootEntityPages.map((entityUrl) => ({
      url: relativeUrl(entityUrl),
      lastModified: new Date(),
      alternates: {
        languages: localesWithoutDefault.reduce(
          (acc, locale) => {
            acc[locale] = relativeUrl(`/${locale}${entityUrl}`);
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    })),
  ];
}
