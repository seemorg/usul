import { makeSearchRequest } from "@/lib/typesense";
import { makePagination, prepareResults, type SearchOptions } from "./utils";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import type { RegionDocument } from "@/types/region";
import { REGIONS_COLLECTION } from "./config";

export const searchRegions = async (q: string, options?: SearchOptions) => {
  const { limit = REGIONS_COLLECTION.DEFAULT_PER_PAGE, page = 1 } =
    options ?? {};

  const filters: string[] = [];

  const results = (await makeSearchRequest(REGIONS_COLLECTION.INDEX, {
    q,
    query_by: REGIONS_COLLECTION.queryBy,
    query_by_weights: REGIONS_COLLECTION.queryByWeights,
    prioritize_token_position: true,
    limit,
    page,
    ...(options?.sortBy &&
      options.sortBy !== "relevance" && { sort_by: options.sortBy }),
    ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
  })) as SearchResponse<RegionDocument>;

  return {
    results: prepareResults(results),
    pagination: makePagination(results.found, results.page, limit),
  };
};
