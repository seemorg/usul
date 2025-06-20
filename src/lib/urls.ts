import type { SearchType } from "@/types/search";
import type { Sort } from "@/types/sort";

export const navigation = {
  search: {
    index: (params: { type: SearchType; query: string }) =>
      `/search?type=${params.type}&q=${params.query}`,
    normal: () => `/search`,
    advanced: () => `/advanced-search`,
  },
  books: {
    all: () => "/texts",
    reader: (bookId: string) => `/t/${bookId}`,
    pageReader: (bookId: string, pageNumber: number) =>
      `/t/${bookId}/${pageNumber}`,
  },
  authors: {
    all: () => "/authors",
    bySlug: (authorSlug: string) => `/author/${authorSlug}`,
  },
  genres: {
    all: () => "/genres",
    bySlug: (genreSlug: string) => `/genre/${genreSlug}`,
  },
  collections: {
    bySlug: (collectionSlug: string) => `/collection/${collectionSlug}`,
  },
  regions: {
    all: () => "/regions",
    bySlug: (slug: string) => `/region/${slug}`,
  },
  centuries: {
    all: () => "/centuries",
    byNumber: (n: number) => `/century/${n}`,
    byYear: (year: number) => `/century/${Math.ceil(year / 100)}`,
  },
  about: () => "/about",
  team: () => "/team",
  donate: () => "/donate",
  login: () => "/login",
  profile: () => "/profile",
};

export const booksSorts = [
  {
    label: "sorts.relevance",
    value: "relevance",
  },
] as const satisfies Sort[];

export const yearsSorts = [
  {
    label: "sorts.relevance",
    value: "relevance",
  },
  {
    label: "sorts.year-asc",
    value: "year-asc",
  },
  {
    label: "sorts.year-desc",
    value: "year-desc",
  },
] as const satisfies Sort[];
