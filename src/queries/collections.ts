import type { Collection } from "@/types/api/collection";
import {
  addBookToCollection,
  addCollection,
  deleteCollection,
  getCollectionBySlug,
  getCollections,
  removeBookFromCollection,
  updateCollection,
} from "@/lib/api/collections";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export type CreateCollectionData = Parameters<typeof addCollection>[0];
export type UpdateCollectionData = Parameters<typeof updateCollection>[1];

// Query Keys
export const collectionKeys = {
  all: ["collections"] as const,
  list: () => [...collectionKeys.all, "list"] as const,
  details: () => [...collectionKeys.all, "detail"] as const,
  bySlug: (
    slug: string,
    filters: {
      page?: number;
      query?: string;
      sortBy?: string;
      genres?: string[];
    } = {},
  ) => [...collectionKeys.details(), "slug", slug, filters] as const,
};

// Queries
export const useCollections = () => {
  return useQuery({
    queryKey: collectionKeys.list(),
    queryFn: getCollections,
    refetchOnMount: true,
  });
};

export const useCollectionBySlug = (
  slug: string,
  {
    page,
    query,
    sortBy,
    genres,
  }: { page?: number; query?: string; sortBy?: string; genres?: string[] } = {},
) => {
  return useQuery({
    queryKey: collectionKeys.bySlug(slug, { page, query, sortBy, genres }),
    queryFn: () =>
      getCollectionBySlug(slug, query, {
        page,
        sortBy,
        filters: { genres: genres ?? null },
      }),
    enabled: !!slug,
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });
};

// Mutations
export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: addCollection,
    onSuccess: (data) => {
      toast.success("Collection created successfully");

      const newCollection = data!.data;
      queryClient.setQueryData(
        collectionKeys.list(),
        (old: { data: Collection[] } | undefined) => {
          return {
            ...old,
            data: [...(old?.data ?? []), newCollection],
          };
        },
      );
      void queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      router.push(navigation.collections.edit(newCollection.slug));
    },
    onError: (error) => {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionData }) =>
      updateCollection(id, data),
    onSuccess: (data, variables) => {
      toast.success("Collection updated successfully");
      const updatedCollection = data?.data;
      void queryClient.invalidateQueries({ queryKey: collectionKeys.list() });

      if (!updatedCollection) {
        return;
      }

      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "collections" &&
          query.queryKey[1] === "detail" &&
          query.queryKey[2] === "slug" &&
          (query.queryKey[3] === updatedCollection.slug ||
            query.queryKey[3] === variables.data.slug),
      });
    },
    onError: () => {
      toast.error("Failed to update collection");
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: (data, variables) => {
      toast.success("Collection deleted successfully");

      // optimistic update
      queryClient.setQueryData(
        collectionKeys.list(),
        (old: { data: Collection[] } | undefined) => {
          return {
            ...old,
            data: old?.data.filter(
              (c) => c.id !== (data?.data.id || variables),
            ),
          };
        },
      );

      void queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      router.push(navigation.collections.all());
    },
    onError: (error) => {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    },
  });
};

export const useAddBookToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      bookId,
    }: {
      collectionId: string;
      bookId: string;
    }) => addBookToCollection(collectionId, bookId),
    onSuccess: (data) => {
      toast.success("Book added to collection successfully");

      if (data?.data) {
        void queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "collections" &&
            query.queryKey[1] === "detail" &&
            query.queryKey[2] === "slug" &&
            query.queryKey[3] === data.data.slug,
        });
      }
    },
    onError: (error) => {
      console.error("Error adding book to collection:", error);
      toast.error("Failed to add book to collection");
    },
  });
};

export const useRemoveBookFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      bookId,
    }: {
      collectionId: string;
      bookId: string;
    }) => removeBookFromCollection(collectionId, bookId),
    onSuccess: (data) => {
      toast.success("Book removed from collection successfully");

      if (data?.data) {
        void queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "collections" &&
            query.queryKey[1] === "detail" &&
            query.queryKey[2] === "slug" &&
            query.queryKey[3] === data.data.slug,
        });
      }
    },
    onError: (error) => {
      console.error("Error removing book from collection:", error);
      toast.error("Failed to remove book from collection");
    },
  });
};

// Utility functions
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
