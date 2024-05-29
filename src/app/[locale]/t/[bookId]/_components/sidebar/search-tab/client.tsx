"use client";

import SidebarContainer from "../sidebar-container";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/navigation";
import { removeDiacritics } from "@/lib/diacritics";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBoolean } from "usehooks-ts";
import { env } from "@/env";
import Spinner from "@/components/ui/spinner";
import { useReaderVirtuoso } from "../../context";
import { useMobileSidebar } from "../../mobile-sidebar-provider";

interface SearchResult {
  chapter: string;
  page: number;
  pageContent: string;
  score: number;
  txtPath: string;
  vol: string;
}

const modes = [
  {
    name: "Keyword",
    description: "Keyword search",
  },
  {
    name: "AI",
    description: "AI search",
  },
];

const SearchResult = ({
  result,
  pagesRange,
  pageToIndex,
}: {
  result: SearchResult;
  pagesRange: { start: number; end: number };
  pageToIndex?: Record<number, number>;
}) => {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();

  const handleNavigate = () => {
    virtuosoRef.current?.scrollToIndex({
      index: pageToIndex
        ? pageToIndex[result.page] ?? result.page - pagesRange.start
        : result.page - pagesRange.start,
      align: "center",
    });

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  return (
    <div
      className="border-b border-gray-600 px-8 py-4 pb-6 transition-colors hover:cursor-pointer hover:bg-gray-100"
      onClick={handleNavigate}
    >
      <div className="flex items-center text-xs text-gray-500">
        <Button variant="ghost" size="icon" className="">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </Button>
      </div>

      <p dir="rtl" className="font-amiri text-lg">
        {removeDiacritics(result.pageContent)}
      </p>

      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <p>Page {result.page}</p>
        <p>{result.chapter}</p>
      </div>
    </div>
  );
};

export default function SearchTab({
  pagesRange,
  pageToIndex,
}: {
  pagesRange: { start: number; end: number };
  pageToIndex?: Record<number, number>;
}) {
  const [activeMode, setActiveMode] = useState(modes[0]?.name);
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
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (q: string) => {
    setLoading(true);

    const results = await fetch(
      `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/search?q=${q}`,
    ).then((res) => res.json());

    setResults(results);
    setLoading(false);
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value) {
      timeoutRef.current = setTimeout(() => {
        fetchResults(value);
      }, 300);
    } else {
      setResults([]);
      setLoading(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const renderResults = () => {
    if (!value)
      return (
        <div className="mt-20 flex flex-col items-center justify-center gap-5">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
          <p className="text-gray-500">Start typing to search</p>
        </div>
      );

    if (loading)
      return (
        <div className="mt-20 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      );

    if (results.length === 0)
      return (
        <div className="mt-20 flex flex-col items-center justify-center gap-5">
          <p className="text-gray-500">No results</p>
        </div>
      );

    return (
      <div className="flex flex-col">
        {results.map((r, idx) => (
          <SearchResult
            key={idx}
            result={r}
            pagesRange={pagesRange}
            pageToIndex={pageToIndex}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Tabs defaultValue="keyword">
        <SidebarContainer className="hidden sm:block">
          <TabsList className="h-10 w-full font-sans">
            <Tooltip>
              <TabsTrigger value="keyword" className="w-full py-1.5" asChild>
                <TooltipTrigger>Keyword</TooltipTrigger>
              </TabsTrigger>

              <TooltipContent side="bottom" sideOffset={10}>
                Keyword search
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TabsTrigger value="ai" className="w-full py-1.5" asChild>
                <TooltipTrigger>AI</TooltipTrigger>
              </TabsTrigger>

              <TooltipContent side="bottom" sideOffset={10}>
                AI search
              </TooltipContent>
            </Tooltip>
          </TabsList>
        </SidebarContainer>
      </Tabs>

      <SidebarContainer>
        {/* <div className="mx-auto flex max-w-[13rem] items-center rounded-full bg-border">
          {modes.map((mode) => (
            <Tooltip key={mode.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveMode(mode.name)}
                  className={cn(
                    "flex-1 rounded-full px-2 py-2 text-xs font-medium",
                    mode.name === activeMode
                      ? "bg-primary text-white"
                      : "text-gray-500",
                  )}
                >
                  {mode.name}
                </button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <p>{mode.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div> */}

        <div className="mt-2 flex items-center gap-2">
          <Button
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
          </Button>

          <Input
            type="text"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for a term (⌘ + F)"
            className="h-10 w-full border border-gray-300 bg-white shadow-none dark:border-border dark:bg-transparent"
          />
        </div>

        {filtersOpen.value && (
          <div className="mt-2 flex flex-col gap-5 rounded-md bg-muted px-4 py-4 dark:bg-accent/80">
            <div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">Book</Label>
                <div className="flex-1">
                  <Input disabled placeholder="Muwatta" className="bg-white" />
                </div>
              </div>

              <p className="mt-1 text-end text-xs">
                To search multiple books use Advanced Search
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="flex-1">Portion</Label>
                <div className="flex-1">
                  <Select>
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
                      <SelectItem value="match">Entire book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-4 flex items-center space-x-2">
              <Switch id="is-ai" />
              <Label htmlFor="is-ai" className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4" /> AI Search
              </Label>
            </div>
          </TooltipTrigger>

          <TooltipContent side="bottom" align="start">
            <p className="max-w-[200px]">
              AI search is a feature that helps you find results based on your
              search query.
            </p>
          </TooltipContent>
        </Tooltip> */}
      </SidebarContainer>

      <Separator className="my-8" />

      {value && (
        <SidebarContainer>
          <div className="flex items-center justify-between">
            <Select>
              <SelectTrigger
                className="h-10 w-auto max-w-full justify-center gap-3 rounded-full border-none bg-transparent p-0 px-0 shadow-none sm:justify-between sm:py-2"
                showIconOnMobile={false}
                icon={<ChevronDownIcon className="h-4 w-4 opacity-50" />}
                // isLoading={isPending}
              >
                <div className="hidden sm:block">
                  {/* {currentSortLabel ? (
            t(currentSortLabel)
          ) : ( */}
                  <SelectValue placeholder={"Sort by"} />
                  {/* )} */}
                </div>
              </SelectTrigger>

              <SelectContent>
                {/* {sorts.map((sort) => (
          <SelectItem key={sort.value} value={sort.value}>
            {t(sort.label)}
          </SelectItem>
        ))} */}
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value={"order"}>Order</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="link" className="gap-2 p-0 text-sm" asChild>
              <Link href="/search">
                View in Advanced Search
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </Button>
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
