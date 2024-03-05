import React, { Suspense } from "react";
import Paginator from "@/components/ui/pagination";
import type { Pagination } from "@/types/pagination";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import SearchSort from "./sort";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import SearchBar from "./search-bar";

interface SearchResultsProps<T extends object & { id: string }> {
  response: SearchResponse<T>;
  renderResult: (
    result: NonNullable<SearchResponse<T>["hits"]>[number],
  ) => JSX.Element;
  pagination?: Pagination;
  emptyMessage?: string;
  sorts: {
    label: string;
    value: string;
  }[];
  currentSort: string;
  currentQuery: string;
  filters?: React.ReactNode;
  placeholder?: string;
}

export default function SearchResults<T extends object & { id: string }>({
  response,
  pagination,
  renderResult,
  emptyMessage = "No matches found",
  sorts,
  filters,
  currentQuery,
  currentSort,
  placeholder,
}: SearchResultsProps<T>) {
  const hasResults = response.hits?.length ?? 0 > 0;

  return (
    <div className="grid grid-cols-4 gap-10 sm:gap-6">
      <div className="hidden w-full sm:block">
        {/* <div className="h-10">
          <h2 className="text-2xl">Filters</h2>
        </div> */}
        {/* mt-5 */}
        <div className="flex flex-col gap-5">{filters}</div>
      </div>

      <div className="col-span-4 sm:col-span-3 sm:pl-1">
        <div className="relative w-full">
          <div className="flex items-center justify-between gap-6">
            <div className="w-full flex-1">
              <SearchBar
                defaultValue={currentQuery}
                placeholder={placeholder}
              />
            </div>

            <div className="flex gap-2">
              <div>
                <SearchSort sorts={sorts} currentSort={currentSort} />
              </div>
              <div className="col-span-4 sm:hidden">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="icon">
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters</DrawerTitle>
                    </DrawerHeader>

                    <div className="mt-5 flex max-h-[70svh] flex-col gap-5 overflow-y-scroll">
                      {filters}
                    </div>

                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>

          {/* <p className="mt-3 flex-shrink-0 text-sm text-muted-foreground">
            {response.found} results in {response.search_time_ms}ms
          </p> */}
        </div>

        <div className="mt-8">
          {/* <div className="mt-5 flex flex-col gap-4"> */}
          {hasResults ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {response.hits!.map((result) => (
                <React.Fragment key={result.document.id}>
                  {renderResult(result)}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">{emptyMessage}</p>
          )}
        </div>

        {pagination && (
          <div className="mt-10">
            <Suspense>
              <Paginator
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
