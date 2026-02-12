import type { SearchType } from "@/types/search";
import type { Sort } from "@/types/sort";

export const navigation = {
  search: (params?: {
    type?: SearchType;
    query?: string;
    searchType?: "keyword" | "semantic";
  }) => {
    const query = new URLSearchParams();
    if (params?.type && params.type !== "all") query.set("type", params.type);
    if (params?.query) query.set("q", params.query);
    if (params?.searchType && params.searchType !== "keyword")
      query.set("searchType", params.searchType);

    return `/search${query.size > 0 ? `?${query.toString()}` : ""}`;
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
    bySlug: (genreSlug: string) => {
      const url = `/genre/${genreSlug}`;
      return url;
    },
  },
  collections: {
    all: () => "/collections",
    static: {
      bySlug: (slug: string) => `/collection/${slug}`,
    },
    bySlug: (slug: string) => `/collections/${slug}`,
    add: () => "/collections/add",
  },
  regions: {
    all: () => "/regions",
    bySlug: (slug: string) => `/region/${slug}`,
  },
  empires: {
    all: () => "/empires",
    bySlug: (slug: string) => `/empire/${slug}`,
  },
  centuries: {
    all: () => "/centuries",
    byNumber: (n: number) => `/century/${n}`,
    byYear: (year: number) => `/century/${Math.ceil(year / 100)}`,
  },
  vision: () => "/vision",
  team: () => "/team",
  donate: () => "/donate",
  login: () => "/login",
  profile: () => "/profile",
  chat: {
    all: () => "/chat",
    byId: (chatId: string) => `/chat/${chatId}`,
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

export const alphabeticalSorts = [
  {
    label: "sorts.alphabetical-asc",
    value: "alphabetical-asc",
  },
  {
    label: "sorts.alphabetical-desc",
    value: "alphabetical-desc",
  },
] as const satisfies Sort[];
