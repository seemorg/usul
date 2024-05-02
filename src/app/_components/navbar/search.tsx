/* eslint-disable react/jsx-key */
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchAllCollections } from "@/server/typesense/global";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import DottedList from "@/components/ui/dotted-list";
import type { GlobalSearchDocument } from "@/types/global-search-document";
import ComingSoonModal from "@/components/coming-soon-modal";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { usePathLocale } from "@/lib/locale/utils";

export default function SearchBar({
  autoFocus,
  size = "sm",
}: {
  autoFocus?: boolean;
  size?: "sm" | "lg";
}) {
  const t = useTranslations("common");
  const entitiesT = useTranslations("entities");
  const [value, setValue] = useState("");
  const focusedState = useBoolean(false);
  const pathLocale = usePathLocale();
  const [debouncedValue] = useDebounceValue(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const { replace } = useRouter();
  const isModalOpen = useBoolean(false);

  const { isLoading, data } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: ({ queryKey }) => {
      const [, query] = queryKey;

      return searchAllCollections(query ?? "", { limit: 5 });
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
  const onItemSelect = (href?: string) => {
    if (href) {
      replace(href);
    } else {
      // push(`/search?q=${debouncedValue}`);
      isModalOpen.setTrue();
    }
  };

  const getLocalizedType = (type: GlobalSearchDocument["type"]) => {
    if (type === "book") {
      return entitiesT("text");
    } else if (type === "author") {
      return entitiesT("author");
    } else if (type === "genre") {
      return entitiesT("genre");
    } else if (type === "region") {
      return entitiesT("region");
    }

    return null;
  };

  const getHref = (document: GlobalSearchDocument) => {
    if (document.type === "book") {
      return navigation.books.reader(document.slug);
    } else if (document.type === "author") {
      return navigation.authors.bySlug(document.slug);
    } else if (document.type === "genre") {
      return navigation.genres.bySlug(document.slug);
    } else if (document.type === "region") {
      return navigation.regions.bySlug(document.slug);
    }

    return null;
  };

  const showList = focusedState.value;
  const showSeeMore = (data?.results?.found ?? 0) > 5 && hits.length > 0;

  return (
    <div className={cn("z-50 w-full")}>
      <ComingSoonModal
        open={isModalOpen.value}
        onOpenChange={isModalOpen.setValue}
      />
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <Command
        shouldFilter={false}
        className={cn(
          "relative overflow-visible",
          size === "lg" && "rounded-[10px] [&_svg]:!h-6 [&_svg]:!w-6",
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
          placeholder={`${t("search-bar.placeholder")}... (⌘ + K)`}
          value={value}
          onValueChange={setValue}
          ref={inputRef}
          autoFocus={autoFocus}
          onFocus={focusedState.setTrue}
          isLoading={isLoading}
          className={cn(size === "lg" && "h-12 py-4 text-base sm:h-14")}
        />

        <div className="absolute inset-y-0 flex items-center ltr:right-2 rtl:left-2">
          <p className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            {/* <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd> */}

            <Button
              variant="ghost"
              className="text-primary hover:text-primary"
              onClick={() => isModalOpen.setTrue()}
            >
              {t("advanced-search")}
            </Button>
          </p>
        </div>

        <CommandList
          className={cn(
            "absolute inset-x-0 bottom-1 z-10 flex max-h-[auto] w-full translate-y-full flex-col overflow-hidden rounded-md rounded-t-none border border-border bg-background text-sm text-foreground shadow",
            showList ? "opacity-100" : "pointer-events-none opacity-0",
            size === "lg" && "rounded-[10px] rounded-t-none",
          )}
        >
          {value && hits.length === 0 && !isLoading && (
            <CommandEmpty> {t("search-bar.no-results")}</CommandEmpty>
          )}

          {!value && (
            <p className="py-6 text-center text-sm">
              {t("search-bar.start-typing")}
            </p>
          )}

          {hits.map((result) => {
            // const primaryArabicName = result.highlight.primaryArabicName
            //   ? result.highlight.primaryArabicName.snippet
            //   : result.document.primaryArabicName;
            const primaryName = getPrimaryLocalizedText(
              result.document.primaryNames,
              pathLocale,
            );
            const secondaryName = getSecondaryLocalizedText(
              result.document.primaryNames,
              pathLocale,
            );

            const authorName = getPrimaryLocalizedText(
              result.document.author?.primaryNames ?? [],
              pathLocale,
            );
            // const primaryLatinName = result.highlight.primaryLatinName
            //   ? result.highlight.primaryLatinName.snippet
            //   : result.document.primaryLatinName;

            // const authorPrimaryLatinName = result.highlight.author
            //   ?.primaryLatinName
            //   ? result.highlight.author.primaryLatinName.snippet
            //   : result.document.author?.primaryLatinName;

            // const authorPrimaryArabicName = result.highlight.author
            //   ?.primaryNames
            //   ? result.highlight.author.primaryNames.snippet
            //   : getPrimaryLocalizedText(
            //       result.document.author?.primaryNames ?? [],
            //       "en",
            //     );

            // use latin name if available, otherwise use arabic name
            // const authorName =
            //   authorPrimaryLatinName || authorPrimaryArabicName;

            // const documentName = primaryArabicName || primaryLatinName;
            // const documentSecondaryName =
            //   documentName === primaryLatinName ? null : primaryLatinName;

            const type = result.document.type;
            const localizedType = getLocalizedType(type);
            const href = getHref(result.document);

            return (
              <SearchItem
                key={result.document.id}
                value={result.document.id}
                onSelect={() => onItemSelect(href ?? undefined)}
                href={href ?? ""}
              >
                {primaryName && (
                  <p
                    className="text-base"
                    dangerouslySetInnerHTML={{ __html: primaryName }}
                  />
                )}

                <DottedList
                  className="gap-1 text-xs"
                  dotClassName="ltr:ml-1 rtl:mr-1"
                  items={[
                    <p>{localizedType}</p>,
                    authorName && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: authorName,
                        }}
                      />
                    ),
                    secondaryName && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: secondaryName,
                        }}
                      />
                    ),
                  ]}
                />
              </SearchItem>
            );
          })}

          {showSeeMore && (
            <ComingSoonModal
              trigger={
                <SearchItem
                  value={`more:${debouncedValue}`}
                  onSelect={() => onItemSelect()}
                  // href={`/search?q=${debouncedValue}`}
                >
                  <p className="text-primary">
                    {t("search-bar.all-results", {
                      results: data?.results?.found ?? 0,
                    })}
                  </p>
                </SearchItem>
              }
            />
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
  href?: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  const Comp = (href ? Link : "button") as any;

  return (
    <CommandItem value={value} onSelect={onSelect} className="px-0 py-0">
      <Comp
        {...(href ? { href } : {})}
        className="flex h-full w-full flex-col items-start gap-3 px-4 py-3 hover:bg-accent"
      >
        {children}
      </Comp>
    </CommandItem>
  );
}
