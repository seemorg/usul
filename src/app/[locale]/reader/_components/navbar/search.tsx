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
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";

/**
 *
 * Todos:
 * - Highlight the search results
 * - header animations
 * - support author search
 * - sidebar snapping
 */

export default function SearchBar() {
  const [value, setValue] = useState("");
  const focusedState = useBoolean(false);
  const [debouncedValue] = useDebounceValue(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isPending, data } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: ({ queryKey }) => {
      const [, query] = queryKey;

      return searchBooks(query ?? "", { limit: 5 });
    },
  });

  const hits = data?.results?.hits ?? [];

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

  const onItemSelect = (id?: string) => {
    if (id) {
      // push(`/reader/${id}`);
      console.log(id);
    } else {
      console.log(id);

      // push(`/search?q=${debouncedValue}`);
    }
  };

  const showList = focusedState.value && data && value;

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
      >
        <CommandInput
          placeholder="Search for a text... (⌘ + K)"
          value={value}
          onValueChange={setValue}
          ref={inputRef}
          onFocus={focusedState.setTrue}
          onBlur={focusedState.setFalse}
          isLoading={isPending}
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
            "absolute inset-x-0 bottom-0 flex max-h-[auto] w-full translate-y-full flex-col divide-y-2 divide-gray-500 overflow-hidden rounded-md rounded-t-none border border-gray-200 bg-white text-sm text-black shadow",
            showList ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <CommandEmpty>No results found.</CommandEmpty>

          {hits.map((result) => (
            <CommandItem
              value={result.document.id}
              key={result.document.id}
              className="flex flex-col items-start gap-3 px-4 py-3 hover:bg-gray-50"
              onSelect={() => onItemSelect(result.document.id)}
            >
              {result.document.primaryArabicName && (
                <p className="text-base">{result.document.primaryArabicName}</p>
              )}

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <p>Text</p>
                <span>•</span>

                {result.document.author.primaryLatinName && (
                  <p>{result.document.author.primaryLatinName}</p>
                )}
                <span>•</span>
                {result.document.primaryLatinName && (
                  <p>{result.document.primaryLatinName}</p>
                )}
              </div>
            </CommandItem>
          ))}

          {(data?.results?.found ?? 0) > 5 && (
            <CommandItem
              value={`more:${debouncedValue}`}
              className="flex flex-col items-start gap-3 px-4 py-3 hover:bg-gray-50"
              onSelect={() => onItemSelect()}
            >
              <p className="text-primary">
                See all results ({data?.results?.found})
              </p>
            </CommandItem>
          )}
        </CommandList>
      </Command>

      {/* <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary sm:text-sm sm:leading-6"
          placeholder="Search"
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={focusedState.setTrue}
          onBlur={focusedState.setFalse}
          ref={inputRef}
        />

        {isPending && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Spinner className="h-5 w-5" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <p className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            Press{" "}
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </p>
        </div>

        {focusedState.value && data && value && (
          <div className="absolute bottom-0 left-0 z-10 flex w-full translate-y-full flex-col divide-y divide-gray-200 rounded rounded-t-none border border-t-0 border-gray-200 bg-white text-sm text-black shadow">
            {hits.length > 0 ? (
              hits.map((result) => (
                <Link
                  href={`/reader/${result.document.id}`}
                  key={result.document.id}
                  className="flex flex-col gap-3 px-4 py-3 hover:bg-gray-50"
                >
                  {result.document.primaryArabicName && (
                    <p className="text-base">
                      {result.document.primaryArabicName}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <p>Book</p>
                    <span>•</span>
                    {result.document.primaryLatinName && (
                      <p>{result.document.primaryLatinName}</p>
                    )}

                    <span>•</span>
                    {result.document.author.primaryLatinName && (
                      <p>{result.document.author.primaryLatinName}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-5">No results found</div>
            )}

            {data.results.found > 5 && (
              <div className="py-3">
                <Button
                  variant="link"
                  asChild
                  className="flex justify-start px-4 py-0 text-sm"
                >
                  <Link href={`/search?q=${value}`}>
                    See all results ({data.results.found})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div> */}
    </div>
  );
}
