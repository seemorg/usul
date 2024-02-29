export const navigation = {
  books: {
    reader: (bookId: string) => `/t/${bookId.replaceAll(".", "-")}`,
  },
  authors: {
    all: () => "/authors",
    bySlug: (authorSlug: string) => `/author/${authorSlug}`,
  },
};

export const booksSorts = [
  {
    label: "Relevance",
    value: "relevance",
  },
] as const;
