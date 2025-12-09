import type { Collection } from "@/types/api/collection";
import type { BookDocument } from "@/types/book";

import type { SearchOptions, SearchResponse } from "./search";
import { apiFetch } from "./utils";

export const getCollections = async () => {
  return await apiFetch<{ data: Collection[] }>("/collections", {
    throw: true,
  });
};

export const checkCollectionSlug = async (slug: string) => {
  return await apiFetch<{ exists: boolean }>("/collections/check-slug", {
    throw: true,
    method: "POST",
    body: { slug },
  });
};

export const getCollectionBySlug = async (
  slug: string,
  { filters, ...options }: SearchOptions & { q?: string } = {},
) => {
  return await apiFetch<
    SearchResponse<BookDocument> & {
      data: Collection & {
        userId: string;
        totalBooks: number;
      };
    }
  >(
    {
      path: `/collections/by-slug/${slug}`,
      params: {
        ...options,
        ...filters,
      },
    },
    {
      throw: true,
    },
  );
};

export const addCollection = async (
  data: Pick<Collection, "name" | "description" | "slug" | "visibility">,
) => {
  return await apiFetch<{ data: Collection }>("/collections", {
    method: "POST",
    body: data,
    throw: true,
  });
};

export const updateCollection = async (
  id: string,
  data: Pick<Collection, "name" | "description" | "slug" | "visibility">,
) => {
  return await apiFetch<{ data: Collection }>(`/collections/${id}`, {
    method: "PUT",
    body: data,
    throw: true,
  });
};

export const addBookToCollection = async (id: string, bookId: string) => {
  return await apiFetch<{ data: Collection }>(`/collections/${id}/add-book`, {
    method: "POST",
    body: { bookId },
    throw: true,
  });
};

export const addBooksToCollection = async (id: string, bookIds: string[]) => {
  return await apiFetch<{ data: Collection }>(`/collections/${id}/add-books`, {
    method: "POST",
    body: { bookIds },
    throw: true,
  });
};

export const removeBookFromCollection = async (id: string, bookId: string) => {
  return await apiFetch<{ data: Collection }>(
    `/collections/${id}/remove-book`,
    {
      method: "POST",
      body: { bookId },
      throw: true,
    },
  );
};

export const deleteCollection = async (id: string) => {
  return await apiFetch<{ data: Collection }>(`/collections/${id}`, {
    method: "DELETE",
    throw: true,
  });
};
