"use client";

import type { BookDocument } from "@/types/book";
import { notFound } from "next/navigation";
import BookSearchResult from "@/components/book-search-result";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DottedList from "@/components/ui/dotted-list";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { yearsSorts } from "@/lib/urls";
import { cn } from "@/lib/utils";
import {
  useCollectionBySlug,
  useRemoveBookFromCollection,
} from "@/queries/collections";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import GenresFilter, { useGenresFilter } from "./genres-filter";
import { Paginator, usePage } from "./paginator";
import SearchBar, { useSearch } from "./search-bar";
import SearchSort, { useSort } from "./sort";

const DeleteBookButton = ({
  book,
  collectionId,
}: {
  book: BookDocument;
  collectionId: string;
}) => {
  const { mutate, isPending } = useRemoveBookFromCollection();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive shrink-0"
      onClick={() => mutate({ collectionId, bookId: book.id })}
      isLoading={isPending}
    >
      <TrashIcon className="size-4" />
    </Button>
  );
};

export default function CollectionBooks({
  slug,
  showDeleteButton = false,
  listOnly = false,
  filters = false,
}: {
  slug: string;
  showDeleteButton?: boolean;
  listOnly?: boolean;
  filters?: boolean;
}) {
  const [search] = useSearch();
  const t = useTranslations();
  const [page] = usePage();
  const [sort] = useSort(yearsSorts.map((s) => s.value));
  const [genres] = useGenresFilter();
  const { data, isLoading, isFetching } = useCollectionBySlug(slug, {
    page,
    query: search,
    sortBy: sort,
    genres,
  });

  if (!data && !isLoading) {
    notFound();
  }

  if (!data) {
    return (
      <div className="w-full">
        {!listOnly && (
          <div className="w-full">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <Skeleton className="h-10 w-2/5" />
                <Skeleton className="mt-5 h-7 w-4/5" />

                <div className="mt-4 flex items-center gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 border-t sm:mt-22">
          <Skeleton className="min-h-50 w-full" />
        </div>
      </div>
    );
  }

  const collection = data.data;
  const pagination = data.pagination;
  const results = data.results;
  const hasResults = results.hits.length > 0;

  const filtersComp = filters ? (
    <>
      <GenresFilter bookIds={collection.books ?? []} isLoading={isFetching} />
    </>
  ) : null;

  return (
    <div>
      {!listOnly && (
        <div>
          <h1 className="text-4xl font-bold lg:text-5xl">{collection.name}</h1>

          {collection.description && (
            <p className="text-muted-foreground mt-5 text-lg">
              {collection.description}
            </p>
          )}

          <DottedList
            className="mt-4"
            items={[
              <Badge
                variant={
                  collection.visibility === "PUBLIC" ? "default" : "secondary"
                }
                className="capitalize"
              >
                {collection.visibility.toLowerCase()}
              </Badge>,
              {
                text: t("entities.x-texts", {
                  count: collection.totalBooks,
                }),
                className: "text-muted-foreground",
              },
            ]}
          />
        </div>
      )}

      <div className={cn("border-t pt-5", listOnly ? "" : "mt-10 sm:mt-16")}>
        <div className="grid grid-cols-4 gap-10 sm:gap-6">
          {filtersComp && (
            <div className="hidden w-full sm:block">
              <div className="flex flex-col gap-5">{filtersComp}</div>
            </div>
          )}

          <div
            className={cn(
              "col-span-4",
              filters ? "sm:col-span-3 sm:ltr:pl-1 sm:rtl:pr-1" : "",
            )}
          >
            <div className="relative w-full">
              <div className="flex items-center justify-between gap-4">
                <div className="w-full flex-1">
                  <SearchBar
                    placeholder={t("entities.search-for", {
                      entity: t("entities.text"),
                    })}
                    isLoading={isFetching}
                  />
                </div>

                <div className="flex gap-2">
                  <div>
                    <SearchSort sorts={yearsSorts} isLoading={isFetching} />
                  </div>

                  {filtersComp && (
                    <div className="col-span-4 sm:hidden">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                          >
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Filters</DrawerTitle>
                          </DrawerHeader>

                          <div className="mt-5 flex max-h-[70svh] flex-col gap-5 overflow-y-scroll">
                            {filtersComp}
                          </div>

                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline" className="flex-1">
                                Close
                              </Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              {hasResults ? (
                <div className="flex flex-col">
                  {results.hits.map((result) => (
                    <div key={result.id} className="flex">
                      <BookSearchResult key={result.id} result={result} />
                      {showDeleteButton && (
                        <DeleteBookButton
                          book={result}
                          collectionId={collection.id}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t("entities.no-entity", {
                    entity: t("entities.texts"),
                  })}
                </p>
              )}
            </div>

            <div className="mt-10">
              <Paginator
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
