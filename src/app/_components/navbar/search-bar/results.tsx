import type { GlobalSearchDocument } from "@/types/global-search-document";
import { useTranslations } from "next-intl";
import SearchBarItem from "./item";
import type { prepareResults } from "@/server/typesense/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComingSoonModal from "@/components/coming-soon-modal";
import type { SearchType } from "@/types/search";
import { CommandEmpty } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

const ResultsSkeleton = () => (
  <div className="flex w-full flex-col gap-2">
    {new Array(5).fill(null).map((_, index) => (
      <div
        key={index}
        className="flex h-10 w-full items-center justify-between gap-2"
      >
        <Skeleton className="h-6 w-64" />

        <Skeleton className="h-6 w-12" />
      </div>
    ))}
  </div>
);

export default function SearchBarResults({
  results,
  onItemSelect,
  searchType,
  setSearchType,
  isLoading,
}: {
  results?: ReturnType<typeof prepareResults<GlobalSearchDocument>>;
  onItemSelect: (href?: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  isLoading?: boolean;
}) {
  const t = useTranslations();
  const entitiesT = useTranslations("entities");

  const hits = results?.hits ?? [];
  const showSeeMore = (results?.found ?? 0) > 5 && hits.length > 0;

  const renderResults = () => {
    if (isLoading) {
      return <ResultsSkeleton />;
    }

    if (hits.length > 0) {
      return hits.map((hit) => (
        <SearchBarItem
          key={hit.document.id}
          document={hit.document}
          onSelect={onItemSelect}
        />
      ));
    }

    return <CommandEmpty>{t("common.search-bar.no-results")}</CommandEmpty>;
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <Tabs
          value={searchType}
          onValueChange={(value) =>
            setSearchType(value as "all" | "texts" | "authors" | "genres")
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="w-full sm:w-auto">
              {entitiesT("all")}
            </TabsTrigger>
            <TabsTrigger value="texts" className="w-full sm:w-auto">
              {entitiesT("texts")}
            </TabsTrigger>
            <TabsTrigger value="authors" className="w-full sm:w-auto">
              {entitiesT("authors")}
            </TabsTrigger>
            <TabsTrigger value="genres" className="w-full sm:w-auto">
              {entitiesT("genres")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {showSeeMore && (
          <ComingSoonModal
            trigger={
              <button className="mt-3 text-primary underline sm:mt-0">
                {t("common.search-bar.all-results", {
                  results: results?.found,
                })}
              </button>
            }
          />
        )}
      </div>

      <div className="mt-5">{renderResults()}</div>
    </div>
  );
}
