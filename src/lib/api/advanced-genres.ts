import type { ApiGenre, ApiGenreCollection } from "@/types/api/genre";
import { cache } from "react";

import type { PathLocale } from "../locale/utils";
import { apiFetch } from "./utils";

export const getAdvancedGenre = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiGenre>({
      path: `/advancedGenre/${slug}`,
      params,
    });
  },
);

export const getAdvancedGenreHierarchy = cache(
  async (params: { locale?: PathLocale } = {}) => {
    return await apiFetch<any[]>({
      path: `/advancedGenre/hierarchy`,
      params,
    });
  },
);

export const findAllGenresWithBooksCount = cache(
  async ({
    yearRange,
    authorId,
    bookIds,
    regionId,
    locale,
  }: {
    yearRange?: [number, number];
    bookIds?: string[];
    authorId?: string;
    regionId?: string;
    locale?: PathLocale;
  } = {}) => {
    const result = await apiFetch<ApiGenre[]>({
      path: "/advancedGenre",
      params: {
        yearRange,
        authorId,
        bookIds,
        regionId,
        locale,
      },
    });

    return result ?? [];
  },
);
