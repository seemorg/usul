import type { GenreDocument } from "@/types/genre";
import { apiFetch } from "@/lib/api";

import type { SearchOptions, SearchResponse } from "./utils";

export const searchGenres = async (q: string, options?: SearchOptions) => {
  return (await apiFetch<SearchResponse<GenreDocument>>(`/search/genres`, {
    q,
    ...(options?.page && { page: options.page.toString() }),
    ...(options?.limit && { limit: options.limit.toString() }),
    ...(options?.sortBy && { sort: options.sortBy }),
  }))!;
};
