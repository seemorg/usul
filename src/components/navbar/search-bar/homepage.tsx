import { useEffect, useRef, useState } from "react";
import { ActionContainer } from "@/app/[locale]/chat/chat-input";
import { Button } from "@/components/ui/button";
import { CommandList } from "@/components/ui/command";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useSearchHistoryStore } from "@/stores/search-history";
import { SearchType } from "@/types/search";
import { Command, CommandInput } from "cmdk";
import { GlobeIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useBoolean, useDebounceValue } from "usehooks-ts";

import SearchBarEmptyState from "./empty-state";
import SearchBarResults from "./results";
import { useSearch } from "./use-search";

export default function HomepageSearchBar({
  setTab,
}: {
  setTab: (tab: "ai" | "search") => void;
}) {
  const t = useTranslations();
  const [value, setValue] = useState("");
  const [searchType, setSearchType] =
    useState<Exclude<SearchType, "content">>("all");
  const focusedState = useBoolean(true);
  const [debouncedValue] = useDebounceValue(value, 300);
  const router = useRouter();
  const addRecentSearch = useSearchHistoryStore((s) => s.addRecentSearch);

  const { data, isLoading } = useSearch({
    searchType,
    value: debouncedValue,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useDetectClickOutside({
    onTriggered: () => {
      focusedState.setFalse();
    },
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

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      clearTimeout(timeout);
    };
  }, []);

  // this function handles keyboard navigation and selection
  const onItemSelect = (href?: string) => {
    addRecentSearch(debouncedValue);
    if (href) {
      router.push(href);
    }

    focusedState.setFalse();
  };

  const showList = focusedState.value;

  return (
    <div
      className="relative flex max-w-3xl flex-col gap-4"
      onClick={() => inputRef.current?.focus()}
      ref={parentRef}
    >
      <Command
        shouldFilter={false}
        className={cn(
          "bg-background border-input has-focus-visible:ring-ring relative h-33.75 overflow-visible rounded-3xl border shadow-[0px_16px_32px_0px_#0000000A] transition-colors has-focus-visible:ring-1 has-focus-visible:outline-hidden has-disabled:cursor-not-allowed has-disabled:opacity-50",
        )}
        onKeyDown={(e) => {
          // When the user presses the escape key, blur the input
          if (e.key === "Escape") {
            e.preventDefault();
            inputRef.current?.blur();
          }
        }}
      >
        <CommandInput
          id="global-search-input"
          className="text-foreground placeholder:text-muted-foreground flex h-12 w-full px-5 pt-4 text-base focus:outline-none"
          value={value}
          onValueChange={setValue}
          ref={inputRef}
          placeholder={`${t("common.search-bar.placeholder")}... (⌘ + K)`}
          autoFocus
          onFocus={() => focusedState.setTrue()}
        />

        <CommandList
          itemID="cmd-list"
          className={cn(
            "bg-background text-foreground border-input absolute inset-x-0 bottom-0 z-10 flex max-h-[auto] w-full translate-y-full flex-col overflow-hidden rounded-3xl border text-sm shadow-[0px_16px_32px_0px_#0000000A] transition-all duration-150 ease-out",
            showList
              ? "translate-y-[calc(100%+0.25rem)] opacity-100"
              : "pointer-events-none translate-y-[calc(100%+1rem)] opacity-0",
          )}
        >
          {debouncedValue ? (
            <div className="p-4">
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

      <ActionContainer className="md:justify-between">
        <Tabs
          className="text-foreground gap-2 rounded-full"
          value="search"
          onValueChange={(value) => setTab(value as "ai" | "search")}
        >
          <TabsList className="rounded-3xl">
            <TabsTrigger value="ai" className="rounded-3xl">
              {t("chat.input.ai_chat")}
            </TabsTrigger>
            <TabsTrigger value="search" className="rounded-3xl">
              {t("chat.input.search")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="text-foreground gap-2 rounded-full"
            asChild
          >
            <Link href={navigation.search()}>
              <GlobeIcon className="size-4" />
              <span className={cn("hidden sm:block")}>
                {t("common.advanced-search")}
              </span>
            </Link>
          </Button>

          <Button
            size="icon"
            className="rounded-full"
            disabled={value.length === 0}
          >
            <SearchIcon className="size-5" />
          </Button>
        </div>
      </ActionContainer>
    </div>
  );
}
