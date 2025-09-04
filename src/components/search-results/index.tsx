import type { SearchResponse } from "@/lib/api/search";
import type { Pagination } from "@/types/pagination";
import type { Sort } from "@/types/sort";
import type { View } from "@/validation/view";
import type { JSX } from "react";
import { Fragment, Suspense } from "react";
import Paginator from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import SearchBar from "./search-bar";
import SearchSort from "./sort";
import ViewSwitcher from "./view-switcher";

interface SearchResultsProps<T extends object & { id: string }> {
  response: SearchResponse<T>["results"];
  renderResult: (result: T) => JSX.Element;
  pagination?: Pagination;
  emptyMessage?: string;
  sorts: Sort[];
  currentSort: string;
  currentQuery: string;
  filters?: React.ReactNode;
  placeholder?: string;
  itemsContainerClassName?: string;
  view?: View;
  showInput?: boolean;
  hasViews?: boolean;
  hasSorts?: boolean;
  label?: React.ReactNode;
  gridColumns?: [number, number];
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
  itemsContainerClassName,
  view,
  showInput = true,
  hasViews = true,
  hasSorts = true,
  label,
  gridColumns = [1, 3],
}: SearchResultsProps<T>) {
  const hasResults = (response.hits.length ?? 0) > 0;

  return (
    <div
      className="grid w-full grid-cols-[var(--total-columns)] gap-10 sm:gap-6"
      style={
        {
          "--total-columns": `repeat(${gridColumns[0] + gridColumns[1]}, minmax(0, 1fr))`,
        } as any
      }
    >
      {filters && (
        <div
          style={
            {
              "--filter-span": `${gridColumns[0]}`,
            } as any
          }
          className={cn(
            "hidden w-full sm:block",
            "sm:col-span-[var(--filter-span)]",
          )}
        >
          <div className="flex flex-col gap-5">{filters}</div>
        </div>
      )}

      <div
        style={
          {
            "--results-span": `${gridColumns[1]}`,
            "--mobile-span": `${gridColumns[0] + gridColumns[1]}`,
          } as any
        }
        className={cn(
          "col-span-[var(--mobile-span)]",
          filters
            ? "sm:col-span-[var(--results-span)] sm:ltr:pl-1 sm:rtl:pr-1"
            : "",
        )}
      >
        <div className="relative w-full">
          <div className="flex items-center justify-between gap-4">
            <div className="w-full flex-1">
              {showInput && (
                <SearchBar
                  defaultValue={currentQuery}
                  placeholder={placeholder}
                />
              )}
              {label}
            </div>

            <div className="flex gap-2">
              {hasSorts && (
                <div>
                  <SearchSort sorts={sorts} currentSort={currentSort} />
                </div>
              )}

              {hasViews && (
                <div>
                  <ViewSwitcher />
                </div>
              )}

              {filters && (
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
                        {filters}
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

          {/* <p className="mt-3 shrink-0 text-sm text-muted-foreground">
            {response.found} results in {response.search_time_ms}ms
          </p> */}
        </div>

        <div className="mt-8">
          {/* <div className="mt-5 flex flex-col gap-4"> */}
          {hasResults ? (
            <div
              className={cn(
                view === "grid"
                  ? "grid grid-cols-2 gap-y-5 sm:gap-5 md:gap-8 lg:grid-cols-3"
                  : "flex flex-col",
                itemsContainerClassName,
              )}
            >
              {response.hits.map((result) => (
                <Fragment key={result.id}>{renderResult(result)}</Fragment>
              ))}
            </div>
          ) : (
            <div className="border-border flex w-full items-center justify-center rounded-md border py-4">
              <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            </div>
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
