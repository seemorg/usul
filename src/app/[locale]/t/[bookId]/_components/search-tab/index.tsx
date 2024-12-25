"use client";

import SidebarContainer from "../sidebar/sidebar-container";
// import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import { ArrowUpRightIcon, ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { type SearchBookResponse, searchBook } from "@/server/services/chat";
import SearchResult from "./SearchResult";
import { useTranslations } from "next-intl";
// import ComingSoonModal from "@/components/coming-soon-modal";
import { usePageNavigation } from "../usePageNavigation";

import { VersionAlert } from "../version-alert";
import { Badge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSearchStore } from "../../_stores/search";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useBookDetails } from "../../_contexts/book-details.context";

export default function SearchTab() {
  const { bookResponse } = useBookDetails();
  const { getVirtuosoScrollProps } = usePageNavigation(bookResponse);
  const t = useTranslations();

  const { value, setValue, page, setPage, type, setType } = useSearchStore();
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

      return await searchBook(_bookId, _q, _type, _page);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue(inputValue, 1);
  };

  const toggleType = (checked: boolean) => {
    setType(checked ? "semantic" : "keyword", 1);
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
        <div className="flex justify-between">
          <div className="flex gap-2">
            {t("common.search")}{" "}
            <Badge variant="tertiary">{t("common.beta")}</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-1" htmlFor="ai-search">
              <SparklesIcon className="size-4" /> Semantic
            </Label>
            <Switch
              id="ai-search"
              checked={type === "semantic"}
              onCheckedChange={toggleType}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0 border-gray-300 shadow-none"
            onClick={filtersOpen.toggle}
          >
            {filtersOpen.value ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            )}
          </Button> */}

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
        </div>

        {/* {filtersOpen.value && (
          <div className="mt-2 flex flex-col gap-5 rounded-md bg-muted px-4 py-4 dark:bg-accent/80">
            <div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">{t("reader.search.book")}</Label>
                <div className="flex-1">
                  <Input disabled placeholder="Muwatta" className="bg-white" />
                </div>
              </div>

              <p className="mt-1 text-end text-xs">
                {t("reader.search.book-select-description")}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">{t("reader.search.portion")}</Label>
                <div className="flex-1">
                  <Select defaultValue="entire-book">
                    <SelectTrigger
                      className="w-full max-w-full justify-center gap-3 bg-white sm:justify-between sm:py-2"
                      showIconOnMobile={false}
                      icon={<ChevronDownIcon className="h-4 w-4 opacity-50" />}
                      // isLoading={isPending}
                    >
                      <div className="hidden sm:block">
                        <SelectValue placeholder={"Sort by"} />
                      </div>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="entire-book">
                        {t("reader.search.entire-book")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </SidebarContainer>

      {/* {results !== null && (
        <SidebarContainer className="mb-4 mt-6">
          <div className="flex items-center justify-between">
            <Select defaultValue="match">
              <SelectTrigger
                className="z-[2] -ml-2 h-10 w-auto max-w-full justify-center gap-2 border-none shadow-none transition-colors hover:bg-gray-100 data-[state=open]:bg-gray-100 sm:justify-between sm:py-2"
                showIconOnMobile={false}
                icon={<></>}
                // isLoading={isPending}
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <div className="hidden sm:block">
                  <SelectValue placeholder={t("common.sorts.placeholder")} />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("common.sorts.placeholder")}</SelectLabel>
                  <SelectItem value="match">
                    {t("reader.search.best-match")}
                  </SelectItem>
                  <SelectItem value="order" disabled>
                    {t("reader.search.order")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <ComingSoonModal
              trigger={
                <Button
                  variant="link"
                  className="flex items-center gap-1 p-0 text-xs"
                >
                  {t("reader.search.view-in-advanced")}
                  <ArrowUpRightIcon className="mt-[1px] h-3 w-3 align-middle" />
                </Button>
              }
            />
          </div>
        </SidebarContainer>
      )} */}

      {renderResults()}

      <SidebarContainer>
        {/* <div className="mt-14">
          <div>
            <Paginator
              totalPages={5}
              currentPage={2}
              showNextAndPrevious={false}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Showing 1 to 10 of 22 results</p>
          </div>
        </div> */}
      </SidebarContainer>

      <div className="h-16" />
    </>
  );
}
