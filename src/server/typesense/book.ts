"use server";

import type { AuthorDocument } from "@/types/author";
import type { BookDocument } from "@/types/book";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { makeMultiSearchRequest } from "@/lib/typesense";

import type { SearchOptions } from "./utils";
import { AUTHORS_COLLECTION, BOOKS_COLLECTION } from "./config";
import { makePagination, prepareQuery, prepareResults } from "./utils";

export const searchBooks = async (q: string, options?: SearchOptions) => {
  const { limit = BOOKS_COLLECTION.DEFAULT_PER_PAGE, page = 1 } = options ?? {};

  const genres = (options?.filters?.genres ?? null) as string[] | null;
  const authors = (options?.filters?.authors ?? null) as string[] | null;
  // const geographies = (options?.filters?.geographies ?? null) as
  //   | string[]
  //   | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;

  // limit search to specific ids
  const ids = (options?.filters?.ids ?? null) as string[] | null;

  const filters: string[] = [];

  if (ids && ids.length > 0) {
    filters.push(`id:[${ids.map((id) => `\`${id}\``).join(", ")}]`);
  }

  if (yearRange) filters.push(`year:[${yearRange[0]}..${yearRange[1]}]`);
  if (genres && genres.length > 0) {
    filters.push(
      `genreIds:[${genres.map((genre) => `\`${genre}\``).join(", ")}]`,
    );
  }

  if (authors && authors.length > 0) {
    filters.push(`authorId:[${authors.map((id) => `\`${id}\``).join(", ")}]`);
  }

  // if (geographies && geographies.length > 0) {
  //   filters.push(
  //     `geographies:[${geographies.map((geo) => `\`${geo}\``).join(", ")}]`,
  //   );
  // }

  if (regions && regions.length > 0) {
    filters.push(
      `regions:[${regions.map((region) => `\`${region}\``).join(", ")}]`,
    );
  }

  // const results = (await makeSearchRequest(TITLES_INDEX, {
  //   q: prepareQuery(q),
  //   query_by: booksQueryBy,
  //   query_by_weights: booksQueryByWeights,
  //   prioritize_token_position: true,
  //   limit,
  //   page,
  //   ...(options?.sortBy &&
  //     options.sortBy !== "relevance" && { sort_by: options.sortBy }),
  //   ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
  // })) as SearchResponse<BookDocument>;

  const results = await makeMultiSearchRequest<{
    results: [SearchResponse<BookDocument>, SearchResponse<AuthorDocument>];
  }>([
    {
      collection: BOOKS_COLLECTION.INDEX,
      q: prepareQuery(q),
      query_by: BOOKS_COLLECTION.queryBy,
      query_by_weights: BOOKS_COLLECTION.queryByWeights,
      prioritize_token_position: "true",
      ...(limit && { limit: limit.toString() }),
      ...(page && { page: page.toString() }),
      ...(options?.sortBy &&
        options.sortBy !== "relevance" && { sort_by: options.sortBy }),
      ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
    },
    ...(authors && authors.length > 0
      ? [
          {
            collection: AUTHORS_COLLECTION.INDEX,
            q: "",
            query_by: "primaryNames.text",
            limit: "100",
            page: "1",
            filter_by: `id:[${authors.map((id) => `\`${id}\``).join(", ")}]`,
          },
        ]
      : []),
  ]);

  const [booksResults, selectedAuthorsResults] = results.results;

  return {
    results: prepareResults(booksResults, "book"),
    pagination: makePagination(booksResults.found, booksResults.page, limit),
    selectedAuthors: selectedAuthorsResults
      ? prepareResults(selectedAuthorsResults)
      : null,
  };

  // return {
  //   results,
  //   pagination: makePagination(results.found, results.page, limit),
  // };
};
