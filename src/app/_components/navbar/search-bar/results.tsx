import type { GlobalSearchDocument } from "@/types/global-search-document";
import { useTranslations } from "next-intl";
import SearchBarItem from "./item";
import type { prepareResults } from "@/server/typesense/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SearchType } from "@/types/search";
import { CommandEmpty } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { Button } from "@/components/ui/button";

const skeletonWidths = [
  [80, 112, 80],
  [112, 112, 80],
  [80, 112, 112],
  [150, 112, 112],
  [112, 80, 80],
];

const ResultsSkeleton = () => (
  <div className="flex w-full flex-col">
    {new Array(5).fill(null).map((_, index) => (
      <div
        key={index}
        className="flex h-12 w-full items-center justify-between gap-2"
      >
        <div className="hidden items-center gap-4 md:flex">
          <Skeleton
            className="bg-accent h-6"
            style={{ width: skeletonWidths[index]![0] }}
          />
          <Skeleton
            className="bg-accent h-6"
            style={{ width: skeletonWidths[index]![1] }}
          />
          <Skeleton
            className="bg-accent h-6"
            style={{ width: skeletonWidths[index]![2] }}
          />
        </div>

        <Skeleton className="bg-accent h-6 w-full md:w-12" />
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
  value,
}: {
  results?: ReturnType<typeof prepareResults<GlobalSearchDocument>>;
  onItemSelect: (href?: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  isLoading?: boolean;
  value: string;
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
          <Link
            href={navigation.search.index({ type: searchType, query: value })}
            className="text-primary mt-3 hidden underline sm:mt-0 sm:block"
          >
            {t("common.search-bar.all-results", {
              results: results?.found ?? 0,
            })}
          </Link>
        )}
      </div>

      <div className="mt-5">
        {renderResults()}
        {showSeeMore && (
          <Button
            asChild
            className="-mx-3 -mb-3 flex px-7 py-6 sm:hidden"
            variant="link"
          >
            <Link
              href={navigation.search.index({ type: searchType, query: value })}
            >
              {t("common.search-bar.all-results", {
                results: results?.found ?? 0,
              })}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
