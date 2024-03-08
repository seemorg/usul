"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchBooks } from "@/lib/search";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";

/**
 *
 * Todos:
 * - support author search
 * - sidebar snapping
 */

export default function SearchBar({ autoFocus }: { autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const focusedState = useBoolean(false);
  const [debouncedValue] = useDebounceValue(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const { replace, push } = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: ({ queryKey }) => {
      const [, query] = queryKey;

      return searchBooks(query ?? "", { limit: 5 });
    },
    enabled: !!debouncedValue,
  });

  const hits = value ? data?.results?.hits ?? [] : [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    // if the input is not focused, and the user clicks outside of the parent element, close the list
    const click = (e: MouseEvent) => {
      if (
        focusedState.value &&
        parentRef.current &&
        !parentRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        focusedState.setFalse();
      }
    };

    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedState.value, focusedState.setFalse]);

  // this function handles keyboard navigation and selection
  const onItemSelect = (id?: string) => {
    if (id) {
      replace(navigation.books.reader(id));
    } else {
      push(`/search?q=${debouncedValue}`);
    }
  };

  const showList = focusedState.value;
  const showSeeMore = (data?.results?.found ?? 0) > 5 && hits.length > 0;

  return (
    <div className="w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <Command
        shouldFilter={false}
        className={cn(
          "relative overflow-visible",
          showList && "rounded-b-none",

          // focusedState.value &&
          //   "outline-none ring-2 ring-white ring-offset-2 ring-offset-primary",
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
          placeholder="Search for a text... (⌘ + K)"
          value={value}
          onValueChange={setValue}
          ref={inputRef}
          autoFocus={autoFocus}
          onFocus={focusedState.setTrue}
          isLoading={isLoading}
        />

        <div className="absolute inset-y-0 right-0 flex items-center">
          <p className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            {/* <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd> */}

            <Button variant="ghost" className="text-primary hover:text-primary">
              Advanced Search
            </Button>
          </p>
        </div>

        <CommandList
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[auto] w-full translate-y-full flex-col overflow-hidden rounded-md rounded-t-none border border-border bg-background text-sm text-foreground shadow",
            showList ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {value && hits.length === 0 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {!value && (
            <p className="py-6 text-center text-sm">Start typing...</p>
          )}

          {hits.map((result) => {
            const primaryArabicName = result.highlight.primaryArabicName
              ? result.highlight.primaryArabicName.snippet
              : result.document.primaryArabicName;
            const primaryLatinName = result.highlight.primaryLatinName
              ? result.highlight.primaryLatinName.snippet
              : result.document.primaryLatinName;

            const authorPrimaryLatinName = result.highlight.author
              ?.primaryLatinName
              ? result.highlight.author.primaryLatinName.snippet
              : result.document.author.primaryLatinName;
            const authorPrimaryArabicName = result.highlight.author
              ?.primaryArabicName
              ? result.highlight.author.primaryArabicName.snippet
              : result.document.author.primaryArabicName;

            // use latin name if available, otherwise use arabic name
            const authorName =
              authorPrimaryLatinName || authorPrimaryArabicName;

            const documentName = primaryArabicName || primaryLatinName;
            const documentSecondaryName =
              documentName === primaryLatinName ? null : primaryLatinName;

            return (
              <SearchItem
                key={result.document.id}
                value={result.document.id}
                onSelect={() => onItemSelect(result.document.slug)}
                href={navigation.books.reader(result.document.slug)}
              >
                {documentName && (
                  <p
                    className="text-base"
                    dangerouslySetInnerHTML={{ __html: documentName }}
                  />
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <p>Text</p>

                  <span>•</span>

                  {authorName && (
                    <p dangerouslySetInnerHTML={{ __html: authorName }} />
                  )}

                  {authorName && documentSecondaryName && <span>•</span>}

                  {documentSecondaryName && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: documentSecondaryName,
                      }}
                    />
                  )}
                </div>
              </SearchItem>
            );
          })}

          {showSeeMore && (
            <SearchItem
              value={`more:${debouncedValue}`}
              onSelect={() => onItemSelect()}
              href={`/search?q=${debouncedValue}`}
            >
              <p className="text-primary">
                See all results ({data?.results?.found})
              </p>
            </SearchItem>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

function SearchItem({
  value,
  onSelect,
  href,
  children,
}: {
  value: string;
  href: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <CommandItem value={value} onSelect={onSelect} className="px-0 py-0">
      <Link
        href={href}
        className="flex h-full w-full flex-col items-start gap-3 px-4 py-3 hover:bg-accent"
      >
        {children}
      </Link>
    </CommandItem>
  );
}
