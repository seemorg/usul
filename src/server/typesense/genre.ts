import { makeSearchRequest } from "@/lib/typesense";
import { makePagination, type SearchOptions } from "./utils";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import type { GenreDocument } from "@/types/genre";
import { GENRES_COLLECTION } from "./config";

export const searchGenres = async (q: string, options?: SearchOptions) => {
  const { limit = GENRES_COLLECTION.DEFAULT_PER_PAGE, page = 1 } =
    options ?? {};

  const filters: string[] = [];

  const results = (await makeSearchRequest(GENRES_COLLECTION.INDEX, {
    q,
    query_by: GENRES_COLLECTION.queryBy,
    query_by_weights: GENRES_COLLECTION.queryByWeights,
    prioritize_token_position: true,
    limit,
    page,
    ...(options?.sortBy &&
      options.sortBy !== "relevance" && { sort_by: options.sortBy }),
    ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
  })) as SearchResponse<GenreDocument>;

  return {
    results,
    pagination: makePagination(results.found, results.page, limit),
  };
};
