"use client";

import SidebarContainer from "../../_components/sidebar/sidebar-container";
import { useEffect, useRef, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBoolean } from "usehooks-ts";
import Spinner from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { searchBook } from "@/server/services/chat";
import SearchResult from "./SearchResult";
import { useTranslations } from "next-intl";
import ComingSoonModal from "@/components/coming-soon-modal";
import type { TabProps } from "../sidebar/tabs";
import { usePageNavigation } from "../usePageNavigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "@/navigation";
import { InfoIcon } from "lucide-react";

export default function SearchTab({ bookSlug, bookResponse }: TabProps) {
  const { getVirtuosoIndex } = usePageNavigation(bookResponse);
  const t = useTranslations();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SemanticSearchBookNode[] | null>(null);

  const { mutateAsync, isPending, error } = useMutation<
    SemanticSearchBookNode[],
    Error,
    string
  >({
    mutationKey: ["search"],
    mutationFn: async (q: string) => {
      if (!q) return [];

      return await searchBook(bookSlug, q);
    },
  });
  const filtersOpen = useBoolean(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // listen for keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "f") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (q: string) => {
    if (!q) {
      setResults(null);
      return;
    }

    const data = await mutateAsync(q);
    setResults(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleSearch(newValue);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const renderResults = () => {
    if (results === null)
      return (
        // TODO: change fixed height
        <div className="mx-auto flex h-[65vh] max-w-[350px] flex-col items-center justify-center px-8 text-center">
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

    if (results.length === 0)
      return (
        <div className="flex h-[71vh] flex-col items-center justify-center gap-5">
          <p className="text-gray-500">{t("common.search-bar.no-results")}</p>
        </div>
      );

    return (
      <div className="flex flex-col">
        {results.map((r, idx) => (
          <SearchResult
            key={idx}
            result={r}
            getVirtuosoIndex={getVirtuosoIndex}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <SidebarContainer>
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

          <div className="relative w-full">
            <Input
              type="text"
              ref={inputRef}
              value={value}
              onChange={handleChange}
              placeholder="Search for a term (⌘ + F)"
              className="h-10 w-full border border-gray-300 bg-white shadow-none dark:border-border dark:bg-transparent"
            />

            {isPending && (
              <Spinner className="absolute right-3 top-3 h-4 w-4" />
            )}
          </div>
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

      <SidebarContainer className="my-4">
        <Alert className="border-border bg-transparent">
          <InfoIcon className="h-5 w-5" />
          <AlertTitle>
            AI has been trained on a different edition of this book
            (VERSION_NAME). You can still use [AI] but the results might be
            slightly different.
          </AlertTitle>
          <AlertDescription className="mt-2">
            <Link href={`/`} className="text-primary underline">
              Switch to (VERSION_NAME)
            </Link>
          </AlertDescription>
        </Alert>
      </SidebarContainer>

      {results !== null && (
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
      )}

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
