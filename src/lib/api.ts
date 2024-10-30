import type {
  ApiBookPageParams,
  ApiBookParams,
  ApiBookResponse,
  ApiBookPageResponse,
} from "@/types/ApiBookResponse";
import { cache } from "react";

const API_BASE = "https://api.usul.ai";

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
  const response = await fetch(
    `${API_BASE}/book/${slug}${prepareParams(params)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.json() as Promise<ApiBookResponse>;
});

const prepareBookPageParams = (params: ApiBookPageParams) => {
  const queryParams = new URLSearchParams();

  if (params.fields) queryParams.set("fields", params.fields.join(","));
  if (params.versionId) queryParams.set("versionId", params.versionId);
  if (params.locale) queryParams.set("locale", params.locale);
  if ("index" in params) {
    queryParams.set("index", params.index.toString());
  } else {
    queryParams.set("page", params.page.toString());
    if (params.volume) queryParams.set("volume", params.volume);
  }

  if (params.includeBook) queryParams.set("includeBook", "true");

  return queryParams.size > 0 ? `?${queryParams.toString()}` : "";
};

export const getBookPage = cache(
  async (slug: string, params: ApiBookPageParams) => {
    const response = await fetch(
      `${API_BASE}/book/page/${slug}${prepareBookPageParams(params)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.json() as Promise<ApiBookPageResponse>;
  },
);
