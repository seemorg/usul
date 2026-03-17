import type { ApiRegion } from "@/types/api/region";
import type { HierarchicalItem } from "@/components/hierarchical-list-view";
import { cache } from "react";

import type { PathLocale } from "../locale/utils";
import { apiFetch } from "./utils";

export const findRegionBySlug = cache(
  async (slug: string, locale: PathLocale = "en") => {
    const result = await apiFetch<ApiRegion>({
      path: `/region/${slug}`,
      params: {
        locale,
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

export const getRegionHierarchy = cache(
  async (locale: PathLocale = "en") => {
    const result = await apiFetch<
      (HierarchicalItem & { numberOfAuthors: number; numberOfBooks: number })[]
    >({
      path: "/region/hierarchy",
      params: { locale },
    });

    return result ?? [];
  },
);

