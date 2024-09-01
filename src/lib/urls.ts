import type { Sort } from "@/types/sort";

export const navigation = {
  books: {
    all: () => "/texts",
    reader: (bookId: string) => `/t/${bookId}`,
    aiTab: (bookId: string) => `/t/${bookId}/ai`,
    searchTab: (bookId: string) => `/t/${bookId}/search`,
  },
  authors: {
    all: () => "/authors",
    bySlug: (authorSlug: string) => `/author/${authorSlug}`,
  },
  genres: {
    all: () => "/genres",
    bySlug: (genreSlug: string) => `/genre/${genreSlug}`,
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
