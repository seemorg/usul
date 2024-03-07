export const navigation = {
  books: {
    reader: (bookId: string) => `/t/${bookId}`,
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
    label: "Relevance",
    value: "relevance",
  },
] as const;

export const authorsSorts = [
  {
    label: "Relevance",
    value: "relevance",
  },
  {
    label: "Year (ASC)",
    value: "year-asc",
  },
  {
    label: "Year (DESC)",
    value: "year-desc",
  },
  {
    label: "No. of books (ASC)",
    value: "books-asc",
  },
  {
    label: "No. of books (DESC)",
    value: "books-desc",
  },
] as const;

export const yearsSorts = [
  {
    label: "Relevance",
    value: "relevance",
  },
  {
    label: "Year (ASC)",
    value: "year-asc",
  },
  {
    label: "Year (DESC)",
    value: "year-desc",
  },
] as const;
