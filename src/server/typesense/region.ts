import type { RegionDocument } from "@/types/region";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { makeSearchRequest } from "@/lib/typesense";

import type { SearchOptions } from "./utils";
import { REGIONS_COLLECTION } from "./config";
import { makePagination, prepareResults } from "./utils";

export const searchRegions = async (q: string, options?: SearchOptions) => {
  const { limit = REGIONS_COLLECTION.DEFAULT_PER_PAGE, page = 1 } =
    options ?? {};

  const filters: string[] = [];

  const results = await makeSearchRequest<SearchResponse<RegionDocument>>(
    REGIONS_COLLECTION.INDEX,
    {
      q,
      query_by: REGIONS_COLLECTION.queryBy,
      query_by_weights: REGIONS_COLLECTION.queryByWeights,
      prioritize_token_position: "true",
      ...(limit && { limit: limit.toString() }),
      ...(page && { page: page.toString() }),
      ...(options?.sortBy &&
        options.sortBy !== "relevance" && { sort_by: options.sortBy }),
      ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
    },
  );

  return {
    results: prepareResults(results, "region"),
    pagination: makePagination(results.found, results.page, limit),
  };
};
