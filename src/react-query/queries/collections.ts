import type { QueryKey } from "@tanstack/react-query";
import { getCollectionBySlug, getCollections } from "@/lib/api/collections";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type CollectionBySlugParams = Parameters<typeof getCollectionBySlug>[1];

export const collectionKeys = {
  all: ["collections"] as const,
  bySlug: (slug: string, params: CollectionBySlugParams = {}) =>
    [...collectionKeys.all, slug, params] as const,
};

export type CollectionsQueryResult = Awaited<ReturnType<typeof getCollections>>;
export const useCollections = () => {
  return useQuery({
    queryKey: collectionKeys.all,
    queryFn: getCollections,
    refetchOnMount: true,
  });
};

export type CollectionBySlugQueryResult = Awaited<
  ReturnType<typeof getCollectionBySlug>
>;
export const matchCollectionKeyBySlug = (queryKey: QueryKey, slug: string) => {
  return queryKey[0] === "collections" && queryKey[1] === slug;
};
export const useCollectionBySlug = (
  slug: string,
  params: CollectionBySlugParams = {},
) => {
  return useQuery({
    queryKey: collectionKeys.bySlug(slug, params),
    queryFn: () => getCollectionBySlug(slug, params),
    enabled: !!slug || slug === "",
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });
};
