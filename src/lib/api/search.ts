import type { PathLocale } from "@/lib/locale/utils";
import type { AuthorDocument } from "@/types/author";
import type { BookDocument } from "@/types/book";
import type { GenreDocument } from "@/types/genre";
import type { GlobalSearchDocument } from "@/types/global-search-document";
import type { Pagination } from "@/types/pagination";
import type { RegionDocument } from "@/types/region";

import { apiFetch } from "./utils";

export interface SearchOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  filters?: Record<string, string | number | string[] | number[] | null>;
  locale?: PathLocale;
}

export interface SearchResponse<T> {
  pagination: Pagination;
  results: {
    found: number;
    page: number;
    hits: T[];
  };
}

export const searchAuthors = async (
  q: string,
  { filters, ...options }: SearchOptions = {},
) => {
  return (await apiFetch<SearchResponse<AuthorDocument>>({
    path: "/search/authors",
    params: {
      q,
      ...options,
      ...filters,
    },
  }))!;
};

export const searchBooks = async (
  q: string,
  { filters, ...options }: SearchOptions = {},
) => {
  return (await apiFetch<
    SearchResponse<BookDocument> & {
      selectedAuthors: SearchResponse<AuthorDocument>["results"] | null;
    }
  >({
    path: "/search/books",
    params: {
      q,
      ...options,
      ...filters,
    },
  }))!;
};

export const searchGenres = async (
  q: string,
  { filters: _, ...options }: SearchOptions = {},
) => {
  return (await apiFetch<SearchResponse<GenreDocument>>({
    path: "/search/genres",
    params: {
      q,
      ...options,
    },
  }))!;
};

export const searchRegions = async (
  q: string,
  { filters: _, ...options }: SearchOptions = {},
) => {
  return (await apiFetch<SearchResponse<RegionDocument>>({
    path: "/search/regions",
    params: {
      q,
      ...options,
    },
  }))!;
};

export const searchAllCollections = async (
  q: string,
  { filters: _, ...options }: SearchOptions = {},
) => {
  return (await apiFetch<SearchResponse<GlobalSearchDocument>>({
    path: "/search/all",
    params: {
      q,
      ...options,
    },
  }))!;
};
