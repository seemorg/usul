import type {
  AlternateSlugResponse,
  ApiBookPageParams,
  ApiBookPageResponse,
  ApiBookParams,
  ApiBookResponse,
  ApiPageIndexParams,
  ApiPageIndexResponse,
} from "@/types/api/book";
import { cache } from "react";

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
