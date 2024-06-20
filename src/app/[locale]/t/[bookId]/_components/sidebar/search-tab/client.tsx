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
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  EllipsisHorizontalIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";

interface SearchResult {
  chapters: string[];
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
  result: SemanticSearchBookNode;
  pagesRange: { start: number; end: number };
  pageToIndex?: Record<number, number>;
}) => {
  const virtuosoRef = useReaderVirtuoso();
  const mobileSidebar = useMobileSidebar();

  const handleNavigate = () => {
    virtuosoRef.current?.scrollToIndex({
      index: pageToIndex
        ? pageToIndex[result.metadata.page] ??
          result.metadata.page - pagesRange.start
        : result.metadata.page - pagesRange.start,
      align: "center",
    });

    if (mobileSidebar.closeSidebar) mobileSidebar.closeSidebar();
  };

  const content = removeDiacritics(result.text).split(" ");
  // content[4] = `<span class="text-primary font-bold">${content[4]}</span>`;
  // content[5] = `<span class="text-primary font-bold">${content[5]}</span>`;
  // content[6] = `<span class="text-primary font-bold">${content[6]}</span>`;

  return (
    <div
      className="border-t border-border px-8 pb-6 pt-3 transition-colors hover:cursor-pointer hover:bg-gray-100"
      onClick={handleNavigate}
    >
      <div className="flex items-center justify-between text-xs text-gray-500">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="btn z-10 hover:bg-gray-200 data-[state=open]:bg-gray-200"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Bookmark</DropdownMenuItem>
            <DropdownMenuItem>Navigate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <p>{result.metadata.chapters.at(-1)}</p>
        </div>
      </div>

      <p
        dir="rtl"
        className="mt-2 font-amiri text-lg"
        dangerouslySetInnerHTML={{
          __html: content.join(" "),
        }}
      />

      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <p>Page {result.metadata.page}</p>
        {result.score ? <span>{(result.score * 100).toFixed(0)}%</span> : null}
      </div>
    </div>
  );
};

export default function SearchTab({
  pagesRange,
  pageToIndex,
  bookSlug,
}: {
  pagesRange: { start: number; end: number };
  pageToIndex?: Record<number, number>;
  bookSlug: string;
}) {
  const [activeMode, setActiveMode] = useState(modes[0]?.name);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SemanticSearchBookNode[] | null>(null);

  const { data, mutateAsync, isPending, error } = useMutation<
    SemanticSearchBookNode[],
    Error,
    string
  >({
    mutationKey: ["search"],
    mutationFn: async (q: string) => {
      if (!q) return [];

      return (
        (await fetch(
          `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/search?q=${q}&bookSlug=${bookSlug}`,
        ).then((res) => res.json())) as SemanticSearchBookNode[]
      ).map((r) => ({
        ...r,
        metadata: {
          ...r.metadata,
          chapters: JSON.parse(r.metadata.chapters as any),
        },
      }));
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
    }, 300);
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
          <SparklesIcon className="h-auto w-8 text-gray-500" />

          <p className="mt-5 font-semibold text-gray-700">Begin Your Search</p>

          <p className="mt-2 text-sm text-gray-500">
            AI Search finds the closest matches even if you don’t know the exact
            phrase. If you know it use{" "}
            <a className="underline" href="#">
              keyword search
            </a>{" "}
            instead.
          </p>
        </div>
      );

    if (error) {
      return (
        <div className="flex h-[71vh] items-center justify-center gap-5">
          <p className="text-red-500">An error occurred</p>
        </div>
      );
    }

    if (results.length === 0)
      return (
        <div className="flex h-[71vh] flex-col items-center justify-center gap-5">
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
      <SidebarContainer className="hidden sm:block">
        <Tabs defaultValue="keyword" className="-mt-6">
          <TabsList className="h-10 w-full rounded-t-none font-sans">
            <Tooltip>
              <TabsTrigger value="keyword" className="w-full py-1.5" asChild>
                <TooltipTrigger>
                  <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                  Keyword
                </TooltipTrigger>
              </TabsTrigger>

              <TooltipContent side="bottom" sideOffset={10}>
                Keyword search
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TabsTrigger value="ai" className="w-full py-1.5" asChild>
                <TooltipTrigger>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  AI
                </TooltipTrigger>
              </TabsTrigger>

              <TooltipContent side="bottom" sideOffset={10}>
                AI search
              </TooltipContent>
            </Tooltip>
          </TabsList>
        </Tabs>
      </SidebarContainer>

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

        <div className="mt-5 flex items-center gap-2">
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

      {/* {!isPending && data && <Separator className="mb-4 mt-6" />} */}

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
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  {/* <SelectItem value="order">Order</SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="link"
              className="flex items-center gap-1 p-0 text-xs"
              asChild
            >
              <Link href="/search">
                View in Advanced Search
                <ArrowUpRightIcon className="mt-[1px] h-3 w-3 align-middle" />
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
