"use client";

import type { SearchType } from "@/types/search";
import React, { useEffect, useRef, useState } from "react";
import ComingSoonModal from "@/components/coming-soon-modal";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { searchAuthors } from "@/server/typesense/author";
import { searchBooks } from "@/server/typesense/book";
import { searchGenres } from "@/server/typesense/genre";
import { searchAllCollections } from "@/server/typesense/global";
import { useSearchHistoryStore } from "@/stores/search-history";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useBoolean, useDebounceValue, useMediaQuery } from "usehooks-ts";

import SearchBarEmptyState from "./empty-state";
import SearchBarResults from "./results";
import { useNavbarStore } from "@/stores/navbar";

const typeToMethod = {
  all: searchAllCollections,
  texts: searchBooks,
  authors: searchAuthors,
  genres: searchGenres,
} satisfies Record<SearchType, any>;

type SearchResults = Awaited<ReturnType<typeof searchAllCollections>>;

export default function SearchBar({
  autoFocus,
  size = "sm",
  isMenu,
}: {
  autoFocus?: boolean;
  size?: "sm" | "lg";
  isMenu?: boolean;
}) {
  const t = useTranslations("common");
  // const showSearch = useNavbarStore(s => s.showSearch);
  const setShowSearch = useNavbarStore((s) => s.setShowSearch);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [value, setValue] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const focusedState = useBoolean(false);

  const [debouncedValue] = useDebounceValue(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useDetectClickOutside({
    onTriggered: () => {
      focusedState.setFalse();
    },
  });

  const { push } = useRouter();
  const isModalOpen = useBoolean(false);
  const addRecentSearch = useSearchHistoryStore((s) => s.addRecentSearch);

  const { isLoading, data } = useQuery<SearchResults>({
    queryKey: ["search", searchType, debouncedValue],
    queryFn: ({ queryKey }) => {
      const [, type, query = ""] = queryKey as [string, SearchType, string];
      const method = typeToMethod[type];
      return method(query ?? "", { limit: 5 }) as Promise<SearchResults>;
    },
    enabled: !!debouncedValue,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // ESC key should blur the input
      if (e.key === "Escape") {
        inputRef.current?.blur();
        focusedState.setFalse();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this function handles keyboard navigation and selection
  const onItemSelect = (href?: string) => {
    if (href) {
      addRecentSearch(debouncedValue);
      push(href);
      focusedState.setFalse();
    } else {
      isModalOpen.setTrue();
    }
  };

  const showList = focusedState.value || isMenu || isMobile;

  return (
    <div className={cn("z-50 w-full")}>
      <ComingSoonModal
        open={isModalOpen.value}
        onOpenChange={isModalOpen.setValue}
      />
      <label htmlFor="global-search-input" className="sr-only">
        Search
      </label>

      <Command
        shouldFilter={false}
        className={cn(
          "relative overflow-visible",
          size === "lg" && "rounded-[10px]",
          showList && "rounded-b-none",
          // focusedState.value &&
          //   "outline-hidden ring-2 ring-white ring-offset-2 ring-offset-primary",
        )}
        loop
        onKeyDown={(e) => {
          // When the user presses the escape key, blur the input
          if (e.key === "Escape") {
            e.preventDefault();
            inputRef.current?.blur();
          }
        }}
        ref={parentRef}
      >
        <CommandInput
          id="global-search-input"
          placeholder={`${t("search-bar.placeholder")}...${isMenu ? "" : " (⌘ + K)"}`}
          value={value}
          onValueChange={setValue}
          ref={inputRef}
          autoFocus={autoFocus}
          onFocus={(e) => {
            if (isMobile && !isMenu) {
              e.preventDefault();
              setShowSearch(true);
            } else {
              focusedState.setTrue();
            }
          }}
          className={cn(size === "lg" && "h-12 py-4 text-base sm:h-14")}
          wrapperClassName={cn(size === "lg" && "[&_svg]:h-6! [&_svg]:w-6!")}
        />

        {/* <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd> */}

        <div className="absolute inset-y-0 flex items-center ltr:right-2 rtl:left-2">
          <p className="text-muted-foreground hidden items-center gap-2 text-sm lg:flex">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary"
              asChild
            >
              <Link href={navigation.search.advanced()}>
                {t("advanced-search")}
              </Link>
            </Button>
          </p>
        </div>

        <CommandList
          itemID="cmd-list"
          className={cn(
            "bg-popover text-foreground absolute inset-x-0 bottom-1 z-10 flex max-h-[auto] w-full translate-y-full flex-col overflow-hidden rounded-md rounded-t-none text-sm",
            !isMenu && "border-border border shadow-sm",
            showList ? "opacity-100" : "pointer-events-none opacity-0",
            size === "lg" && "rounded-[10px] rounded-t-none",
          )}
        >
          {debouncedValue ? (
            <div className={cn(isMenu ? "p-2" : "p-3 sm:p-6")}>
              <SearchBarResults
                results={data?.results}
                isLoading={isLoading}
                onItemSelect={onItemSelect}
                searchType={searchType}
                setSearchType={setSearchType}
                value={debouncedValue}
              />
            </div>
          ) : (
            <SearchBarEmptyState setValue={setValue} />
          )}
        </CommandList>
      </Command>
    </div>
  );
}
