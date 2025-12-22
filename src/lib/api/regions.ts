import type { ApiLocation } from "@/types/api/location";
import type { ApiRegion } from "@/types/api/region";
import { cache } from "react";

import type { PathLocale } from "../locale/utils";
import { apiFetch } from "./utils";

export const findRegionBySlug = cache(
  async (slug: string, locale: PathLocale = "en") => {
    const result = await apiFetch<ApiRegion & { locations: ApiLocation[] }>({
      path: `/region/${slug}`,
      params: {
        locale,
        locations: true,
      },
    });
    return result ?? null;
  },
);

export const findAllRegionsWithBooksCount = cache(
  async (
    params?: {
      yearRange?: [number, number];
      genreId?: string;
    },
    locale: PathLocale = "en",
  ) => {
    const result = await apiFetch<ApiRegion[]>({
      path: "/region",
      params: {
        locale,
        ...params,
      },
    });

    return result ?? [];
  },
);

