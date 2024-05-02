"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import type { AuthorDocument } from "@/types/author";
import FilterContainer from "../search-results/filter-container";
import type { findAllAuthorIdsWithBooksCount } from "@/server/services/authors";
import { usePathname, useRouter } from "@/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "~/i18n.config";
import { searchAuthors } from "@/server/typesense/author";
import { usePathLocale } from "@/lib/locale/utils";
import { getPrimaryLocalizedText } from "@/server/db/localization";

const getAuthorsFilterUrlParams = (
  authors: string[],
  searchParams: URLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);

  // make sure to reset pagination state
  if (params.has("page")) {
    params.delete("page");
  }

  if (authors.length > 0) {
    params.set("authors", authors.join(","));
  } else {
    params.delete("authors");
  }

  return params;
};

const DEBOUNCE_DELAY = 300;

interface AuthorsFilterProps {
  initialAuthorsResponse: Awaited<ReturnType<typeof searchAuthors>>;
  booksCount: Awaited<ReturnType<typeof findAllAuthorIdsWithBooksCount>>;
  currentAuthors: string[];
  selectedAuthorsResponse: SearchResponse<AuthorDocument> | null;
  filters?: Record<string, any>;
}

export default function _AuthorsFilter({
  currentAuthors,
  initialAuthorsResponse,
  selectedAuthorsResponse,
  booksCount,
  filters,
}: AuthorsFilterProps) {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const pathLocale = usePathLocale();
  const formatter = useFormatter();
  const [selectedAuthors, setSelectedAuthors] =
    useState<string[]>(currentAuthors);

  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState("");
  const [pageToResponse, setPageToResponse] = useState<
    Record<number, Awaited<ReturnType<typeof searchAuthors>>>
  >({
    1: initialAuthorsResponse,
  });
  const [loading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();

  useEffect(() => {
    setSelectedAuthors(currentAuthors);
  }, [currentAuthors]);

  useEffect(() => {
    setPageToResponse({ 1: initialAuthorsResponse });
  }, [initialAuthorsResponse]);

  const fetchAuthors = async (
    q: string,
    p: number,
    options: { reset?: boolean } = {},
  ) => {
    setIsLoading(true);

    const results = await searchAuthors(q, {
      page: p,
      limit: 10,
      sortBy: "booksCount:desc,_text_match:desc",
      filters,
    });

    setPageToResponse((prev) => ({
      ...(options.reset ? {} : prev),
      [p]: results,
    }));
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setPage(1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      fetchAuthors(newValue, 1, { reset: true });
    }, DEBOUNCE_DELAY);

    // @ts-ignore
    searchTimeoutRef.current = newTimeout;
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
    fetchAuthors(value, page + 1);
  };

  const handleChange = (authorId: string) => {
    let newSelectedAuthors = [...selectedAuthors];
    if (newSelectedAuthors.includes(authorId)) {
      newSelectedAuthors = newSelectedAuthors.filter((g) => g !== authorId);
    } else {
      newSelectedAuthors.push(authorId);
    }
    setSelectedAuthors(newSelectedAuthors);

    const params = getAuthorsFilterUrlParams(newSelectedAuthors, searchParams);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, DEBOUNCE_DELAY);

    // @ts-ignore
    timeoutRef.current = newTimeout;
  };

  const data = useMemo(() => {
    const allResponses = Object.values(pageToResponse);
    const hasMore = allResponses[allResponses.length - 1]?.pagination?.hasNext;
    const items = allResponses.flatMap((r) => r?.results?.hits ?? []);

    if (!selectedAuthorsResponse) {
      return {
        items,
        hasMore,
      };
    }

    const selectedHits = selectedAuthorsResponse.hits ?? [];
    const selectedIds = new Set(selectedHits.map((i) => i.document.id));

    return {
      items: selectedHits.concat(
        items.filter((item) => !selectedIds.has(item.document.id)),
      ),
      hasMore,
    };
  }, [pageToResponse, selectedAuthorsResponse]);

  const authorIdToBooksCount = useMemo(() => {
    return Object.fromEntries(
      booksCount.map((item) => [item.id, item.numberOfBooks]),
    );
  }, [booksCount]);

  return (
    <FilterContainer
      title={t("entities.author")}
      isLoading={isPending || loading}
      clearFilterHref={
        selectedAuthors.length > 0
          ? {
              pathname,
              query: getAuthorsFilterUrlParams([], searchParams).toString(),
            }
          : undefined
      }
    >
      <FilterContainer.Input
        placeholder={t("entities.search-for", { entity: t("entities.author") })}
        value={value}
        onChange={handleInputChange}
      />

      <FilterContainer.List className="font-inter mt-5">
        {data.items.map((item) => {
          const author = item.document;
          const authorId = author.id;

          const booksCount = formatter.number(
            authorIdToBooksCount[authorId] ?? 0,
          );

          const name = getPrimaryLocalizedText(
            item.document.primaryNames,
            pathLocale,
          );

          const title = `${name} (${booksCount})`;

          return (
            <FilterContainer.Checkbox
              key={authorId}
              id={authorId}
              checked={selectedAuthors.includes(authorId)}
              onCheckedChange={() => handleChange(authorId)}
              title={title}
              count={booksCount}
            >
              {name}
            </FilterContainer.Checkbox>
          );
        })}

        {data.hasMore && (
          <Button onClick={handleLoadMore} variant="link">
            {t("common.load-more")}
          </Button>
        )}
      </FilterContainer.List>
    </FilterContainer>
  );
}
