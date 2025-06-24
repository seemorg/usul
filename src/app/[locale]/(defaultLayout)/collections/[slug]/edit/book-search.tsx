import type { BookDocument } from "@/types/book";
import { useRef, useState } from "react";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDeathYear } from "@/lib/date";
import { useDirection, usePathLocale } from "@/lib/locale/utils";
import { cn } from "@/lib/utils";
import { searchBooks } from "@/server/typesense/book";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useBoolean, useDebounceValue } from "usehooks-ts";

interface BookSearchProps {
  onBookSelect: (book: BookDocument) => void;
  excludeBookIds?: string[];
  placeholder?: string;
  isAdding?: boolean;
}

export default function BookSearch({
  onBookSelect,
  excludeBookIds = [],
  placeholder = "Search books...",
  isAdding = false,
}: BookSearchProps) {
  const t = useTranslations();
  const dir = useDirection();
  const pathLocale = usePathLocale();
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusedState = useBoolean(false);

  const parentRef = useDetectClickOutside({
    onTriggered: () => {
      focusedState.setFalse();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["book-search", debouncedValue, currentPage],
    queryFn: () =>
      searchBooks(debouncedValue, { limit: 10, page: currentPage }),
    enabled: !!debouncedValue && debouncedValue.length > 2,
  });

  const filteredBooks =
    data?.results.hits.filter((book) => !excludeBookIds.includes(book.id)) ??
    [];

  const handleBookSelect = (book: BookDocument) => {
    if (isAdding) return; // Prevent selection while adding
    onBookSelect(book);
    setValue("");
    focusedState.setFalse();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const title = (book: BookDocument) => {
    return book.transliteration && pathLocale === "en"
      ? book.transliteration
      : book.primaryName;
  };

  const authorName = (book: BookDocument) => {
    return book.author.transliteration && pathLocale === "en"
      ? book.author.transliteration
      : book.author.primaryName;
  };

  const showList =
    focusedState.value && (debouncedValue.length > 2 || isLoading);

  const hasNextPage = data?.pagination.hasNext ?? false;
  const hasPrevPage = data?.pagination.hasPrev ?? false;
  const totalPages = data?.pagination.totalPages ?? 0;

  return (
    <div className="relative w-full">
      <Command
        shouldFilter={false}
        className={cn(
          "relative overflow-visible",
          showList && "rounded-b-none",
        )}
        loop
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            inputRef.current?.blur();
            focusedState.setFalse();
          }
        }}
        ref={parentRef}
      >
        <CommandInput
          placeholder={placeholder}
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            setCurrentPage(1); // Reset to first page when search changes
          }}
          ref={inputRef}
          onFocus={() => focusedState.setTrue()}
          disabled={isAdding}
        />

        <CommandList
          className={cn(
            "bg-popover text-foreground border-border absolute inset-x-0 bottom-1 z-10 flex max-h-[auto] w-full translate-y-full flex-col overflow-hidden rounded-md rounded-t-none border text-sm shadow-sm",
            showList ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <>
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between p-2",
                    isAdding
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-accent",
                  )}
                  onClick={() => handleBookSelect(book)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      {isAdding ? (
                        <Loader2Icon className="text-muted-foreground h-4 w-4 animate-spin" />
                      ) : (
                        <PlusIcon className="text-muted-foreground h-4 w-4" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-medium"
                          dir={dir}
                          dangerouslySetInnerHTML={{ __html: title(book) }}
                        />
                        <p className="text-muted-foreground truncate text-xs">
                          {authorName(book)} (
                          {formatDeathYear(book.author.year, pathLocale)})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t p-2">
                  <Pagination>
                    <PaginationContent>
                      {hasPrevPage && (
                        <PaginationItem>
                          <PaginationPrevious
                            asElement="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                          />
                        </PaginationItem>
                      )}

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show current page, first page, last page, and pages around current
                          const range = 1;
                          return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - range &&
                              page <= currentPage + range)
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const prevPage = array[index - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;

                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && (
                                <span className="text-muted-foreground px-2">
                                  ...
                                </span>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  asElement="button"
                                  isActive={page === currentPage}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </div>
                          );
                        })}

                      {hasNextPage && (
                        <PaginationItem>
                          <PaginationNext
                            asElement="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground p-4 text-center text-sm">
              {debouncedValue.length > 2
                ? t("common.search-bar.no-results")
                : "Type to search books..."}
            </div>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
