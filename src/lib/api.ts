import type {
  ApiBookPageParams,
  ApiBookParams,
  ApiBookResponse,
  ApiBookPageResponse,
  ApiPageIndexParams,
  ApiPageIndexResponse,
  AlternateSlugResponse,
} from "@/types/ApiBookResponse";
import { cache } from "react";

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
