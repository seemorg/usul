import type { ApiAuthor } from "@/types/api/author";
import type {
  ApiBookPageParams,
  ApiBookParams,
  ApiBookResponse,
  ApiBookPageResponse,
  ApiPageIndexParams,
  ApiPageIndexResponse,
  AlternateSlugResponse,
} from "@/types/api/book";
import { cache } from "react";
import type { PathLocale } from "./locale/utils";
import type { ApiGenre } from "@/types/api/genre";
import type { ApiRegion } from "@/types/api/region";

const API_BASE = "https://api.usul.ai";

const apiFetch = async <T>(url: string): Promise<T | null> => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok || response.status >= 300) return null;

  return response.json() as Promise<T>;
};

const prepareParams = (params: ApiBookParams) => {
  const queryParams = new URLSearchParams();

  if (params.fields) queryParams.set("fields", params.fields.join(","));
  if (params.versionId) queryParams.set("versionId", params.versionId);
  if (params.locale) queryParams.set("locale", params.locale);
  if (params.startIndex)
    queryParams.set("startIndex", params.startIndex.toString());

  if (params.size) queryParams.set("size", params.size.toString());
  if (params.includeBook) queryParams.set("includeBook", "true");

  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

export const getBook = cache(async (slug: string, params: ApiBookParams) => {
  return await apiFetch<ApiBookResponse | AlternateSlugResponse>(
    `/book/${slug}${prepareParams(params)}`,
  );
});

const prepareBookPageParams = (params: ApiBookPageParams) => {
  const queryParams = new URLSearchParams();

  queryParams.set("index", params.index.toString());
  if (params.fields) queryParams.set("fields", params.fields.join(","));
  if (params.versionId) queryParams.set("versionId", params.versionId);
  if (params.locale) queryParams.set("locale", params.locale);
  if (params.includeBook) queryParams.set("includeBook", "true");

  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

export const getBookPage = cache(
  async (slug: string, params: ApiBookPageParams) => {
    return await apiFetch<ApiBookPageResponse | AlternateSlugResponse>(
      `/book/page/${slug}${prepareBookPageParams(params)}`,
    );
  },
);

const preparePageIndexParams = (params: ApiPageIndexParams) => {
  const queryParams = new URLSearchParams();

  queryParams.set("page", params.page.toString());
  if (params.versionId) queryParams.set("versionId", params.versionId);
  if (params.volume) queryParams.set("volume", params.volume.toString());

  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

export const getBookPageIndex = cache(
  async (slug: string, params: ApiPageIndexParams) => {
    return await apiFetch<ApiPageIndexResponse | AlternateSlugResponse>(
      `/book/page_index/${slug}${preparePageIndexParams(params)}`,
    );
  },
);

const prepareAuthorParams = (params: { locale?: PathLocale }) => {
  const queryParams = new URLSearchParams();

  if (params.locale) queryParams.set("locale", params.locale);

  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

export const getAuthorBySlug = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiAuthor>(
      `/author/${slug}${prepareAuthorParams(params)}`,
    );
  },
);

export const getGenre = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiGenre>(
      `/genre/${slug}${prepareAuthorParams(params)}`,
    );
  },
);

export const getRegion = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiRegion>(
      `/region/${slug}${prepareAuthorParams(params)}`,
    );
  },
);
