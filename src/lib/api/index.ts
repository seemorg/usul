import type { ApiAuthor } from "@/types/api/author";
import type {
  AlternateSlugResponse,
  ApiBookPageParams,
  ApiBookPageResponse,
  ApiBookParams,
  ApiBookResponse,
  ApiPageIndexParams,
  ApiPageIndexResponse,
} from "@/types/api/book";
import type { ApiGenre, ApiGenreCollection } from "@/types/api/genre";
import type { ApiRegion } from "@/types/api/region";
import { cache } from "react";
import { unstable_cache } from "next/cache";

import type { PathLocale } from "../locale/utils";
import { apiFetch } from "./utils";

export const getBook = cache(async (slug: string, params: ApiBookParams) => {
  return await apiFetch<ApiBookResponse | AlternateSlugResponse>({
    path: `/book/${slug}`,
    params,
  });
});

export const getBookPage = cache(
  async (slug: string, params: ApiBookPageParams) => {
    return await apiFetch<ApiBookPageResponse | AlternateSlugResponse>({
      path: `/book/page/${slug}`,
      params,
    });
  },
);

export const getBookPageIndex = cache(
  async (slug: string, params: ApiPageIndexParams) => {
    return await apiFetch<ApiPageIndexResponse | AlternateSlugResponse>({
      path: `/book/page_index/${slug}`,
      params,
    });
  },
);

export const getAuthorBySlug = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiAuthor>({
      path: `/author/${slug}`,
      params,
    });
  },
);

export const getGenre = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiGenre>({
      path: `/genre/${slug}`,
      params,
    });
  },
);

export const getRegion = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiRegion>({
      path: `/region/${slug}`,
      params,
    });
  },
);

export const getHomepageGenres = cache(
  async (params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiGenreCollection[]>({
      path: `/genre/homepage`,
      params,
    });
  },
);

export const getTotalEntities = cache(async () => {
  return unstable_cache(
    async () => {
      const defaultResponse = {
        books: 0,
        authors: 0,
        regions: 0,
        genres: 0,
      };

      return (
        (await apiFetch<typeof defaultResponse>(`/total`)) || defaultResponse
      );
    },
    ["total"],
    {
      revalidate: false, // make this static
      tags: ["total"],
    },
  )();
});
