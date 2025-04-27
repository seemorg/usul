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

import type { PathLocale } from "./locale/utils";
import { prepareSearchParams } from "./params";

const API_BASE = "https://api.usul.ai";

const apiFetch = async <T>(
  url: string,
  params?: Record<string, string>,
): Promise<T | null> => {
  const finalUrl = `${API_BASE}${url}${prepareSearchParams(params)}`;
  const response = await fetch(finalUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok || response.status >= 300) return null;

  return response.json() as Promise<T>;
};

export const getBook = cache(async (slug: string, params: ApiBookParams) => {
  return await apiFetch<ApiBookResponse | AlternateSlugResponse>(
    `/book/${slug}`,
    {
      ...(params.fields && { fields: params.fields.join(",") }),
      ...(params.versionId && { versionId: params.versionId }),
      ...(params.locale && { locale: params.locale }),
      ...(params.startIndex && { startIndex: params.startIndex.toString() }),
      ...(params.size && { size: params.size.toString() }),
      ...(params.includeBook && { includeBook: "true" }),
    },
  );
});

export const getBookPage = cache(
  async (slug: string, params: ApiBookPageParams) => {
    return await apiFetch<ApiBookPageResponse | AlternateSlugResponse>(
      `/book/page/${slug}`,
      {
        index: params.index.toString(),
        ...(params.fields && { fields: params.fields.join(",") }),
        ...(params.versionId && { versionId: params.versionId }),
        ...(params.locale && { locale: params.locale }),
        ...(params.includeBook && { includeBook: "true" }),
      },
    );
  },
);

export const getBookPageIndex = cache(
  async (slug: string, params: ApiPageIndexParams) => {
    return await apiFetch<ApiPageIndexResponse | AlternateSlugResponse>(
      `/book/page_index/${slug}`,
      {
        page: params.page.toString(),
        ...(params.versionId && { versionId: params.versionId }),
        ...(params.volume && { volume: params.volume.toString() }),
      },
    );
  },
);

export const getAuthorBySlug = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiAuthor>(`/author/${slug}`, params);
  },
);

export const getGenre = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiGenre>(`/genre/${slug}`, params);
  },
);

export const getRegion = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiRegion>(`/region/${slug}`, params);
  },
);

export const getHomepageGenres = cache(
  async (params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiGenreCollection[]>(`/genre/homepage`, params);
  },
);

export const getTotalEntities = cache(async () => {
  return unstable_cache(
    async () =>
      (await apiFetch<{
        books: number;
        authors: number;
        regions: number;
        genres: number;
      }>(`/total`)) || {
        books: 0,
        authors: 0,
        regions: 0,
        genres: 0,
      },
    ["total"],
    {
      revalidate: false, // make this static
      tags: ["total"],
    },
  )();
});
