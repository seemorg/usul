"use server";

import type { AuthorDocument } from "@/types/author";
import type { BookDocument } from "@/types/book";
import type { Pagination } from "@/types/pagination";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { makeMultiSearchRequest, makeSearchRequest } from "./typesense";

const AUTHORS_INDEX = "authors";
const TITLES_INDEX = "books";

const DEFAULT_AUTHORS_PER_PAGE = 5;
const DEFAULT_BOOKS_PER_PAGE = 20;

const makePagination = (
  totalRecords: number,
  currentPage: number,
  perPage: number,
): Pagination => {
  const totalPages = Math.ceil(totalRecords / perPage);

  return {
    totalRecords,
    totalPages,
    currentPage,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
};

interface SearchOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  filters?: Record<string, string | number | string[] | number[] | null>;
}

const authorsQueryWeights = {
  2: ["primaryArabicName", "primaryLatinName"],
  1: ["_nameVariations", "otherArabicNames", "otherLatinNames"],
};
const authorsQueryBy = Object.values(authorsQueryWeights).flat().join(", ");
const authorsQueryByWeights = Object.keys(authorsQueryWeights)
  // @ts-expect-error - TS doesn't like the fact that we're using Object.keys
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  .map((weight) => new Array(authorsQueryWeights[weight]!.length).fill(weight))
  .flat()
  .join(", ");

export const searchAuthors = async (q: string, options?: SearchOptions) => {
  const { limit = DEFAULT_AUTHORS_PER_PAGE, page = 1 } = options ?? {};

  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;
  const geographies = (options?.filters?.geographies ?? null) as
    | string[]
    | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const ids = (options?.filters?.ids ?? null) as string[] | null;

  const filters: string[] = [];
  if (yearRange) filters.push(`year:[${yearRange[0]}..${yearRange[1]}]`);

  if (geographies && geographies.length > 0) {
    filters.push(
      `geographies:[${geographies.map((geo) => `\`${geo}\``).join(", ")}]`,
    );
  }

  if (regions && regions.length > 0) {
    filters.push(
      `regions:[${regions
        .flatMap((region) => {
          return ["born", "died", "visited", "resided"].map(
            (type) => `\`${type}@${region}\``,
          );
        })
        .join(", ")}]`,
    );
  }

  if (ids && ids.length > 0) {
    filters.push(`id:[${ids.map((id) => `\`${id}\``).join(", ")}]`);
  }

  const results = (await makeSearchRequest(AUTHORS_INDEX, {
    q: prepareQuery(q),
    query_by: authorsQueryBy,
    query_by_weights: authorsQueryByWeights,
    prioritize_token_position: true,
    limit,
    page,
    ...(options?.sortBy &&
      options.sortBy !== "relevance" && { sort_by: options.sortBy }),
    ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
  })) as SearchResponse<AuthorDocument>;

  return {
    results,
    pagination: makePagination(results.found, results.page, limit),
  };
};

const booksQueryWeights = {
  4: ["primaryArabicName", "primaryLatinName"],
  3: ["_nameVariations", "otherArabicNames", "otherLatinNames"],
  2: ["author.primaryArabicName", "author.primaryLatinName"],
  1: [
    "author._nameVariations",
    "author.otherArabicNames",
    "author.otherLatinNames",
  ],
};

const booksQueryBy = Object.values(booksQueryWeights).flat().join(", ");
const booksQueryByWeights = Object.keys(booksQueryWeights)
  // @ts-expect-error - TS doesn't like the fact that we're using Object.keys
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  .map((weight) => new Array(booksQueryWeights[weight]!.length).fill(weight))
  .flat()
  .join(", ");

export const searchBooks = async (q: string, options?: SearchOptions) => {
  const { limit = DEFAULT_BOOKS_PER_PAGE, page = 1 } = options ?? {};

  const genres = (options?.filters?.genres ?? null) as string[] | null;
  const authors = (options?.filters?.authors ?? null) as string[] | null;
  const geographies = (options?.filters?.geographies ?? null) as
    | string[]
    | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;

  const filters: string[] = [];
  if (yearRange) filters.push(`year:[${yearRange[0]}..${yearRange[1]}]`);
  if (genres && genres.length > 0) {
    filters.push(
      `genreTags:[${genres.map((genre) => `\`${genre}\``).join(", ")}]`,
    );
  }

  if (authors && authors.length > 0) {
    filters.push(`authorId:[${authors.map((id) => `\`${id}\``).join(", ")}]`);
  }

  if (geographies && geographies.length > 0) {
    filters.push(
      `geographies:[${geographies.map((geo) => `\`${geo}\``).join(", ")}]`,
    );
  }

  if (regions && regions.length > 0) {
    filters.push(
      `regions:[${regions
        .flatMap((region) => {
          return ["born", "died", "visited", "resided"].map(
            (type) => `\`${type}@${region}\``,
          );
        })
        .join(", ")}]`,
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

  const results = (await makeMultiSearchRequest([
    {
      collection: TITLES_INDEX,
      q: prepareQuery(q),
      query_by: booksQueryBy,
      query_by_weights: booksQueryByWeights,
      prioritize_token_position: true,
      limit,
      page,
      ...(options?.sortBy &&
        options.sortBy !== "relevance" && { sort_by: options.sortBy }),
      ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
    },

    ...(authors && authors.length > 0
      ? [
          {
            collection: AUTHORS_INDEX,
            q: "",
            query_by: "primaryArabicName",
            limit: 100,
            page: 1,
            filter_by: `id:[${authors.map((id) => `\`${id}\``).join(", ")}]`,
          },
        ]
      : []),
  ])) as {
    results: [SearchResponse<BookDocument>, SearchResponse<AuthorDocument>];
  };

  const [booksResults, selectedAuthorsResults] = results.results;

  return {
    results: booksResults,
    pagination: makePagination(booksResults.found, booksResults.page, limit),
    selectedAuthors: selectedAuthorsResults ?? null,
  };

  // return {
  //   results,
  //   pagination: makePagination(results.found, results.page, limit),
  // };
};

const prepareQuery = (q: string) => {
  const final = [q];

  const queryWithoutAl = q.replace(/(al-)/gi, "");
  if (queryWithoutAl !== q) final.push(queryWithoutAl);

  return final.join(" || ");
};
