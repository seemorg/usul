import type {
  ApiBookPageParams,
  ApiBookParams,
  ApiBookResponse,
  ApiBookPageResponse,
  ApiPageIndexParams,
  ApiPageIndexResponse,
} from "@/types/ApiBookResponse";
import { cache } from "react";

const API_BASE = "https://api.usul.ai";
// const API_BASE = "http://0.0.0.0:8080";

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
  try {
    const response = await fetch(
      `${API_BASE}/book/${slug}${prepareParams(params)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok || response.status >= 300) return null;

    return response.json() as Promise<ApiBookResponse>;
  } catch (e) {
    return null;
  }
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
    try {
      const response = await fetch(
        `${API_BASE}/book/page/${slug}${prepareBookPageParams(params)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok || response.status >= 300) return null;

      return response.json() as Promise<ApiBookPageResponse>;
    } catch (e) {
      return null;
    }
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
    const response = await fetch(
      `${API_BASE}/book/page_index/${slug}${preparePageIndexParams(params)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.json() as Promise<ApiPageIndexResponse>;
  },
);
