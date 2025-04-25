"use server";

import { makeSearchRequest } from "@/lib/typesense";
import { makePagination, prepareQuery, prepareResults } from "./utils";
import type { SearchOptions } from "./utils";
import { GLOBAL_SEARCH_COLLECTION } from "./config";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import type { GlobalSearchDocument } from "@/types/global-search-document";

export const searchAllCollections = async (
  q: string,
  options?: SearchOptions,
) => {
  const { limit = GLOBAL_SEARCH_COLLECTION.DEFAULT_PER_PAGE, page = 1 } =
    options ?? {};

  const results = (await makeSearchRequest(GLOBAL_SEARCH_COLLECTION.INDEX, {
    q: prepareQuery(q),
    query_by: GLOBAL_SEARCH_COLLECTION.queryBy,
    query_by_weights: GLOBAL_SEARCH_COLLECTION.queryByWeights,
    prioritize_token_position: true,
    limit,
    page,
    sort_by: "_text_match(buckets: 10):desc,_rank:asc,_popularity:desc",
    // ...(options?.sortBy &&
    //   options.sortBy !== "relevance" && { sort_by: options.sortBy }),
  })) as SearchResponse<GlobalSearchDocument>;

  return {
    results: prepareResults(results),
    pagination: makePagination(results.found, results.page, limit),
  };
};
