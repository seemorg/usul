import type { AuthorDocument } from "@/types/author";
import type { BookDocument } from "@/types/book";
import { apiFetch } from "@/lib/api";

import type { SearchOptions, SearchResponse } from "./utils";

export const searchBooks = async (q: string, options?: SearchOptions) => {
  const genres = (options?.filters?.genres ?? null) as string[] | null;
  const authors = (options?.filters?.authors ?? null) as string[] | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;

  // limit search to specific ids
  const ids = (options?.filters?.ids ?? null) as string[] | null;

  return (await apiFetch<
    SearchResponse<BookDocument> & {
      selectedAuthors: SearchResponse<AuthorDocument>["results"] | null;
    }
  >(`/search/books`, {
    q,
    ...(options?.page && { page: options.page.toString() }),
    ...(options?.limit && { limit: options.limit.toString() }),
    ...(options?.sortBy && { sort: options.sortBy }),
    ...(genres && genres.length > 0 && { genres: genres.join(",") }),
    ...(authors && authors.length > 0 && { authors: authors.join(",") }),
    ...(regions && regions.length > 0 && { regions: regions.join(",") }),
    ...(yearRange &&
      yearRange.length > 0 && { yearRange: yearRange.join(",") }),
    ...(ids && ids.length > 0 && { ids: ids.join(",") }),
  }))!;
};
