import type { AuthorDocument } from "@/types/author";
import { apiFetch } from "@/lib/api";

import type { SearchOptions, SearchResponse } from "./utils";

export const searchAuthors = async (q: string, options?: SearchOptions) => {
  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const ids = (options?.filters?.ids ?? null) as string[] | null;

  return (await apiFetch<SearchResponse<AuthorDocument>>(`/search/authors`, {
    q,
    ...(options?.page && { page: options.page.toString() }),
    ...(options?.limit && { limit: options.limit.toString() }),
    ...(options?.sortBy && { sort: options.sortBy }),
    ...(yearRange &&
      yearRange.length > 0 && { yearRange: yearRange.join(",") }),
    ...(regions && regions.length > 0 && { regions: regions.join(",") }),
    ...(ids && ids.length > 0 && { ids: ids.join(",") }),
  }))!;
};
