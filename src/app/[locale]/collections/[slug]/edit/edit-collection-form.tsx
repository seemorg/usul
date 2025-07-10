"use client";

import type { BookDocument } from "@/types/book";
import { notFound, useParams } from "next/navigation";
import { useAddBookToCollection } from "@/react-query/mutations/collections";
import { useCollectionBySlug } from "@/react-query/queries/collections";
import { useTranslations } from "next-intl";

import CollectionFormSkeleton from "../../collection-form-skeleton";
import CollectionBooks from "../collection-books";
import BookSearch from "./book-search";

export default function EditCollectionForm() {
  const { slug } = useParams();
  const { data: collectionData, isLoading } = useCollectionBySlug(
    slug as string,
  );
  const t = useTranslations();
  const { mutate, isPending } = useAddBookToCollection();

  const collection = collectionData?.data;

  if (isLoading) {
    return <CollectionFormSkeleton />;
  }

  if (!collection) {
    notFound();
  }

  const handleAddBook = (book: BookDocument) => {
    mutate({
      collectionId: collection.id,
      bookId: book.id,
    });
  };

  const books = collectionData.results.hits;
  const excludeBookIds = books.map((book) => book.id);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="mb-4">
          <label className="mb-2 text-sm font-medium">
            {t("entities.x-texts", { count: books.length })}
          </label>

          <BookSearch
            onBookSelect={handleAddBook}
            excludeBookIds={excludeBookIds}
            placeholder={t("entities.search-for", {
              entity: t("entities.text"),
            })}
            isAdding={isPending}
          />
        </div>

        <CollectionBooks slug={collection.slug} showDeleteButton listOnly />
      </div>
    </div>
  );
}
