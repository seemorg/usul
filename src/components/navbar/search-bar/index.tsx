"use client";

import type { SearchType } from "@/types/search";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useNavbarStore } from "@/stores/navbar";
import { useSearchHistoryStore } from "@/stores/search-history";
import { useTranslations } from "next-intl";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useBoolean, useDebounceValue, useMediaQuery } from "usehooks-ts";

import SearchBarEmptyState from "./empty-state";
import SearchBarResults from "./results";
import { useSearch } from "./use-search";

export default function SearchBar({
  autoFocus,
  isMenu,
}: {
  autoFocus?: boolean;
  isMenu?: boolean;
}) {
  const t = useTranslations("common");
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
  const addRecentSearch = useSearchHistoryStore((s) => s.addRecentSearch);

  const { isLoading, data } = useSearch({
    searchType,
    value: debouncedValue,
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
  }, []);

  // this function handles keyboard navigation and selection
  const onItemSelect = (href?: string) => {
    addRecentSearch(debouncedValue);
    if (href) {
      push(href);
    }

    // if the user is on mobile, we need to close the search bar
    setShowSearch(false);
    focusedState.setFalse();
  };

  const showList = focusedState.value || isMenu;

  return (
    <div className={cn("z-50 w-full")}>
      <label htmlFor="global-search-input" className="sr-only">
        Search
      </label>

      <Command
        shouldFilter={false}
        className={cn(
          "relative overflow-visible",

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
          wrapperClassName={cn(isMenu && "px-4")}
        />

        <div className="absolute inset-y-0 flex items-center ltr:right-2 rtl:left-2">
          <p className="text-muted-foreground hidden items-center gap-2 text-sm lg:flex">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary"
              asChild
            >
              <Link href={navigation.search.normal()}>
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
          )}
        >
          {debouncedValue ? (
            <div className={cn(isMenu ? "px-3 py-2" : "p-3 sm:p-6")}>
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
