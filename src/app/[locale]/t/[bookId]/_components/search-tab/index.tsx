"use client";

import SidebarContainer from "../sidebar/sidebar-container";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Spinner from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { searchBook } from "@/server/services/chat";
import SearchResult from "./SearchResult";
import { useTranslations } from "next-intl";
import { usePageNavigation } from "../usePageNavigation";

import { VersionAlert } from "../version-alert";
import { Badge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSearchStore } from "../../_stores/search";
import { useState } from "react";

import { useBookDetails } from "../../_contexts/book-details.context";
import { AzureSearchFilter, buildQuery } from "./search-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchTab() {
  const { bookResponse } = useBookDetails();
  const { getVirtuosoScrollProps } = usePageNavigation();
  const t = useTranslations();

  const {
    value,
    setValue,
    page,
    setPage,
    type,
    setType,
    advancedQuery,
    setAdvancedQuery,
  } = useSearchStore();
  const [inputValue, setInputValue] = useState(value);

  const isVersionMismatch =
    type === "semantic"
      ? bookResponse.book.aiVersion !== bookResponse.content.id
      : bookResponse.book.keywordVersion !== bookResponse.content.id;

  const bookContent = bookResponse.content;
  const isExternal =
    bookContent.source === "external" || bookContent.source === "pdf";
  const headings = !isExternal ? bookContent.headings : [];

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", bookResponse.book.id, value, type, page] as const,
    queryFn: async ({ queryKey }) => {
      const [, _bookId, _q, _type, _page] = queryKey;
      if (!_q) return null;

      return await searchBook(
        _bookId,
        _q,
        _type === "simple" || _type === "advanced" ? "keyword" : "semantic",
        _page,
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (type === "semantic" || type === "simple") {
      setValue(inputValue, 1);
    } else {
      setValue(buildQuery(advancedQuery), 1);
    }
  };

  const renderResults = () => {
    if (!results)
      return (
        // TODO: change fixed height
        <div className="mx-auto flex h-[50vh] max-w-[350px] flex-col items-center justify-center px-8 text-center md:h-[65vh]">
          <MagnifyingGlassIcon className="h-auto w-8 text-gray-500" />

          <p className="mt-5 font-semibold text-gray-700">
            {t("reader.search.begin-search")}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {t("reader.search.description")}
          </p>
        </div>
      );

    if (error) {
      return (
        <div className="flex h-[71vh] items-center justify-center gap-5">
          <p className="text-red-500">{t("common.coming-soon.error")}</p>
        </div>
      );
    }

    if (results.total === 0 || results.results.length === 0)
      return (
        <div className="flex h-[71vh] flex-col items-center justify-center gap-5">
          <p className="text-gray-500">{t("common.search-bar.no-results")}</p>
        </div>
      );

    return (
      <div className="mt-9">
        <div className="flex flex-col">
          {results.results.map((r, idx) => (
            <SearchResult
              key={idx}
              result={r}
              getVirtuosoScrollProps={getVirtuosoScrollProps}
              headings={headings}
            />
          ))}
        </div>

        <SidebarContainer className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {results.total} Results - Page {results.currentPage} /{" "}
            {results.totalPages}
          </p>

          <div className="flex">
            <Button
              variant="ghost"
              disabled={!results.hasPreviousPage}
              onClick={() => setPage(page - 1)}
              size="sm"
            >
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>

            <Button
              variant="ghost"
              disabled={!results.hasNextPage}
              onClick={() => setPage(page + 1)}
              size="sm"
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </SidebarContainer>
      </div>
    );
  };

  return (
    <>
      {isVersionMismatch && (
        <SidebarContainer className="my-4">
          <VersionAlert
            versionId={bookResponse.book.aiVersion!}
            versions={bookResponse.book.versions}
            feature="search"
          />
        </SidebarContainer>
      )}

      <SidebarContainer>
        <div className="flex items-center justify-between">
          <div className="flex flex-grow-0 gap-2">
            {t("common.search")}{" "}
            <Badge variant="tertiary">{t("common.beta")}</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Select value={type} onValueChange={(t) => setType(t as any, 1)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="semantic">Semantic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {type === "simple" || type === "semantic" ? (
            <form className="flex w-full items-center" onSubmit={handleSubmit}>
              <div className="relative flex-1">
                {isLoading ? (
                  <Spinner className="absolute top-3 h-4 w-4 ltr:left-3 rtl:right-3" />
                ) : (
                  <MagnifyingGlassIcon className="absolute top-3 h-4 w-4 ltr:left-3 rtl:right-3" />
                )}

                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder={t("reader.search.placeholder")}
                  className="mr-10 h-10 w-full flex-1 border border-gray-300 bg-white pl-9 shadow-none focus:outline-none focus:ring-inset dark:border-border dark:bg-transparent ltr:rounded-r-none rtl:rounded-l-none"
                />
              </div>

              <Button
                size="icon"
                className="size-10 flex-shrink-0 ltr:rounded-l-none rtl:rounded-r-none"
                disabled={isLoading}
              >
                <ChevronRightIcon className="size-5" />
              </Button>
            </form>
          ) : (
            <>
              <AzureSearchFilter
                value={advancedQuery}
                setValue={setAdvancedQuery}
              />

              <div>
                <Button disabled={isLoading} onClick={() => handleSubmit()}>
                  Apply
                </Button>
              </div>
            </>
          )}
        </div>
      </SidebarContainer>

      {renderResults()}

      <div className="h-16" />
    </>
  );
}
