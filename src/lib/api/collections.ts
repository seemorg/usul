import type { SearchOptions, SearchResponse } from "@/server/typesense/utils";
import type { Collection } from "@/types/api/collection";
import type { BookDocument } from "@/types/book";

import { apiFetch } from ".";

export const getCollections = async () => {
  return await apiFetch<{ data: Collection[] }>("/collections", undefined, {
    credentials: "include",
    throw: true,
  });
};

export const checkCollectionSlug = async (slug: string) => {
  return await apiFetch<{ exists: boolean }>(
    `/collections/check-slug`,
    undefined,
    {
      credentials: "include",
      throw: true,
      method: "POST",
      body: JSON.stringify({ slug }),
    },
  );
};

export const getCollectionBySlug = async (
  slug: string,
  q: string = "",
  options?: SearchOptions,
) => {
  const genres = (options?.filters?.genres ?? null) as string[] | null;
  const authors = (options?.filters?.authors ?? null) as string[] | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;

  return await apiFetch<
    SearchResponse<BookDocument> & {
      data: Collection & {
        userId: string;
        totalBooks: number;
      };
    }
  >(
    `/collections/by-slug/${slug}`,
    {
      q,
      ...(options?.page && { page: options.page.toString() }),
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.sortBy && { sort: options.sortBy }),
      ...(genres && genres.length > 0 && { genres: genres.join(",") }),
      ...(authors && authors.length > 0 && { authors: authors.join(",") }),
      ...(regions && regions.length > 0 && { regions: regions.join(",") }),
      ...(yearRange &&
        yearRange.length > 0 && { yearRange: yearRange.join(",") }),
      ...(options?.locale && { locale: options.locale }),
    },
    {
      credentials: "include",
      throw: true,
    },
  );
};

export const addCollection = async (
  data: Pick<Collection, "name" | "description" | "slug" | "visibility">,
) => {
  return await apiFetch<{ data: Collection }>(`/collections`, undefined, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    throw: true,
  });
};

export const updateCollection = async (
  id: string,
  data: Pick<Collection, "name" | "description" | "slug" | "visibility">,
) => {
  return await apiFetch<{ data: Collection }>(`/collections/${id}`, undefined, {
    method: "PUT",
    body: JSON.stringify(data),
    credentials: "include",
    throw: true,
  });
};

export const addBookToCollection = async (id: string, bookId: string) => {
  return await apiFetch<{ data: Collection }>(
    `/collections/${id}/add-book`,
    undefined,
    {
      method: "POST",
      body: JSON.stringify({ bookId }),
      credentials: "include",
      throw: true,
    },
  );
};

export const removeBookFromCollection = async (id: string, bookId: string) => {
  return await apiFetch<{ data: Collection }>(
    `/collections/${id}/remove-book`,
    undefined,
    {
      method: "POST",
      body: JSON.stringify({ bookId }),
      credentials: "include",
      throw: true,
    },
  );
};

export const deleteCollection = async (id: string) => {
  return await apiFetch<{ data: Collection }>(`/collections/${id}`, undefined, {
    method: "DELETE",
    credentials: "include",
    throw: true,
  });
};
