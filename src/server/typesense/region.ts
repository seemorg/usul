import type { RegionDocument } from "@/types/region";
import { apiFetch } from "@/lib/api";

import type { SearchOptions, SearchResponse } from "./utils";

export const searchRegions = async (q: string, options?: SearchOptions) => {
  return (await apiFetch<SearchResponse<RegionDocument>>(`/search/regions`, {
    q,
    ...(options?.page && { page: options.page.toString() }),
    ...(options?.limit && { limit: options.limit.toString() }),
    ...(options?.sortBy && { sort: options.sortBy }),
  }))!;
};
