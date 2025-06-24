"use client";

import type { BookDocument } from "@/types/book";
import { notFound, useParams } from "next/navigation";
import {
  useAddBookToCollection,
  useCollectionBySlug,
} from "@/queries/collections";
import { useTranslations } from "next-intl";

import CollectionForm from "../../collection-form";
import CollectionFormSkeleton from "../../collection-form-skeleton";
import CollectionBooks from "../collection-books";
import BookSearch from "./book-search";
import DangerZone from "./danger-zone";

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
      <div className="max-w-2xl">
        <CollectionForm
          mode="edit"
          initialData={{
            name: collection.name,
            description: collection.description,
            slug: collection.slug,
            visibility: collection.visibility,
          }}
          collectionId={collection.id}
        />
      </div>

      <div className="border-t pt-6">
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

      <div className="border-t pt-6">
        <DangerZone collection={collection} />
      </div>
    </div>
  );
}
