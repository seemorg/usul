import type { GlobalSearchDocument } from "@/types/global-search-document";
import { apiFetch } from "@/lib/api";

import type { SearchOptions, SearchResponse } from "./utils";

export const searchAllCollections = async (
  q: string,
  options?: SearchOptions,
) => {
  return (await apiFetch<SearchResponse<GlobalSearchDocument>>(`/search/all`, {
    q,
    ...(options?.page && { page: options.page.toString() }),
    ...(options?.limit && { limit: options.limit.toString() }),
    ...(options?.sortBy && { sort: options.sortBy }),
  }))!;
};
