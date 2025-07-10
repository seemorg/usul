import {
  addBookToCollection,
  addCollection,
  deleteCollection,
  removeBookFromCollection,
  updateCollection,
} from "@/lib/api/collections";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CollectionsQueryResult } from "../queries/collections";
import {
  collectionKeys,
  matchCollectionKeyBySlug,
} from "../queries/collections";

// Mutations
export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: addCollection,
    onMutate: async (newCollection) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: collectionKeys.all });

      // Snapshot the previous value
      const previousCollections =
        queryClient.getQueryData<CollectionsQueryResult>(collectionKeys.all);

      // Optimistically update to the new value
      queryClient.setQueryData(
        collectionKeys.all,
        (old: CollectionsQueryResult) => ({
          data: [...(old?.data ?? []), newCollection],
        }),
      );

      // Return a context object with the snapshotted value
      return { previousCollections };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newCollection, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(
          collectionKeys.all,
          context.previousCollections,
        );
      }
      console.error("Error creating collection:", err);
      toast.error("Failed to create collection");
    },
    onSuccess: () => {
      toast.success("Collection created successfully");
      router.push(navigation.collections.all());
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
};

export const useUpdateCollection = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Parameters<typeof updateCollection>[1]) =>
      updateCollection(id, data),
    onMutate: async (updatedCollection) => {
      await queryClient.cancelQueries({ queryKey: collectionKeys.all });

      const previousCollections =
        queryClient.getQueryData<CollectionsQueryResult>(collectionKeys.all);

      queryClient.setQueryData(
        collectionKeys.all,
        (old: CollectionsQueryResult) => ({
          data: old?.data.map((c) =>
            c.id === updatedCollection.id
              ? {
                  ...c,
                  ...updatedCollection,
                }
              : c,
          ),
        }),
      );

      return { previousCollections };
    },
    onError: (err, _, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(
          collectionKeys.all,
          context.previousCollections,
        );
      }

      console.error("Error updating collection:", err);
      toast.error("Failed to update collection");
    },
    onSuccess: () => {
      toast.success("Collection updated successfully");
      onSuccess?.();
    },
    onSettled: (_, __, updateCollectionInput) => {
      void queryClient.invalidateQueries({ queryKey: collectionKeys.all });
      void queryClient.invalidateQueries({
        predicate: (query) =>
          matchCollectionKeyBySlug(query.queryKey, updateCollectionInput.slug),
      });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCollection,
    onMutate: async (collectionId) => {
      await queryClient.cancelQueries({ queryKey: collectionKeys.all });

      const previousCollections =
        queryClient.getQueryData<CollectionsQueryResult>(collectionKeys.all);

      queryClient.setQueryData(
        collectionKeys.all,
        (old: CollectionsQueryResult) => ({
          data: old?.data.filter((c) => c.id !== collectionId),
        }),
      );

      return { previousCollections };
    },
    onError: (err, _, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(
          collectionKeys.all,
          context.previousCollections,
        );
      }
      console.error("Error deleting collection:", err);
      toast.error("Failed to delete collection");
    },
    onSuccess: () => {
      toast.success("Collection deleted successfully");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: collectionKeys.all });
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
    onError: (err) => {
      console.error("Error adding book to collection:", err);
      toast.error("Failed to add book to collection");
    },
    onSuccess: () => {
      toast.success("Book added to collection successfully");
    },
    onSettled: (data) => {
      if (data) {
        void queryClient.invalidateQueries({
          predicate: (query) =>
            matchCollectionKeyBySlug(query.queryKey, data.data.slug),
        });
      }
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
    onError: (err) => {
      console.error("Error removing book from collection:", err);
      toast.error("Failed to remove book from collection");
    },
    onSuccess: () => {
      toast.success("Book removed from collection successfully");
    },
    onSettled: (data) => {
      if (data) {
        void queryClient.invalidateQueries({
          predicate: (query) =>
            matchCollectionKeyBySlug(query.queryKey, data.data.slug),
        });
      }
    },
  });
};
