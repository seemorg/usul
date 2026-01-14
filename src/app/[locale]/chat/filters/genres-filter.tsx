import type { GenreDocument, GenreNode } from "@/types/genre";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Spinner from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api/utils";
import { useDirection, usePathLocale } from "@/lib/locale/utils";
import { cn } from "@/lib/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, FoldersIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebounceValue } from "usehooks-ts";

import { FilterButton } from "./utils";

// Convert GenreNode to GenreDocument for compatibility with the store
const genreNodeToDocument = (node: GenreNode): GenreDocument => ({
  type: "genre",
  id: node.id,
  slug: node.slug,
  primaryName: node.primaryName,
  secondaryName: node.secondaryName,
  booksCount: node.numberOfBooks,
});

// Filter genres by search query (similar to hierarchical-genre-view)
function filterGenresByQuery(genres: GenreNode[], query: string): GenreNode[] {
  if (!query) return genres;

  const lowerQuery = query.toLowerCase();

  const filtered: GenreNode[] = [];

  for (const genre of genres) {
    const matchesName =
      genre.primaryName.toLowerCase().includes(lowerQuery) ||
      (genre.secondaryName &&
        genre.secondaryName.toLowerCase().includes(lowerQuery));

    const filteredChildren = genre.children
      ? filterGenresByQuery(genre.children, query)
      : [];

    // Include genre if it matches or has matching children
    if (matchesName || filteredChildren.length > 0) {
      filtered.push({
        ...genre,
        children:
          filteredChildren.length > 0 ? filteredChildren : genre.children,
      });
    }
  }

  return filtered;
}

interface HierarchicalItemProps {
  genre: GenreNode;
  depth: number;
  handleSelect: (genre: GenreNode) => void;
  selectedIds: Set<string>;
  searchQuery?: string;
  defaultExpanded: boolean;
}

const HierarchicalItem = ({
  genre,
  depth,
  handleSelect,
  selectedIds,
  searchQuery,
  defaultExpanded,
}: HierarchicalItemProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = genre.children && genre.children.length > 0;
  const isSelected = selectedIds.has(genre.id);
  const t = useTranslations();
  const direction = useDirection();

  // Sync local state with prop changes when expand/collapse all is clicked
  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "border-border hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-4 transition-colors",
          depth > 0 && (direction === "rtl" ? "border-r-4" : "border-l-4"),
        )}
        style={{
          [direction === "rtl" ? "marginRight" : "marginLeft"]:
            `${depth * 1.5}rem`,
        }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground mt-0.5 flex-shrink-0"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        )}

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Checkbox
            className="size-6 flex-shrink-0"
            id={`${genre.id}-genre-filter`}
            checked={isSelected}
            onCheckedChange={() => handleSelect(genre)}
          />

          <Label
            htmlFor={`${genre.id}-genre-filter`}
            className="flex min-w-0 flex-1 items-baseline justify-between gap-2"
          >
            <p className="font-semibold">{genre.primaryName}</p>
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {t("entities.x-texts", { count: genre.numberOfBooks })}
            </span>
          </Label>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-2 flex flex-col gap-2">
          {genre.children!.map((child) => (
            <HierarchicalItem
              key={child.id}
              genre={child}
              depth={depth + 1}
              handleSelect={handleSelect}
              selectedIds={selectedIds}
              searchQuery={searchQuery}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function GenresFilterContent({ onBack }: { onBack?: () => void }) {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const locale = usePathLocale();
  const selectedGenres = useChatFilters((s) => s.selectedGenres);
  const addGenre = useChatFilters((s) => s.addGenre);
  const removeGenre = useChatFilters((s) => s.removeGenre);

  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 300);
  const [expandAll, setExpandAll] = useState(false);

  const { data: hierarchy, isLoading } = useQuery({
    queryKey: ["genre-hierarchy", locale] as const,
    queryFn: async () => {
      const result = await apiFetch<GenreNode[]>({
        path: `/advancedGenre/hierarchy`,
        params: { locale },
      });
      return result ?? [];
    },
  });

  const selectedIds = useMemo(
    () => new Set(selectedGenres.map((g) => g.id)),
    [selectedGenres],
  );

  const filteredHierarchy = useMemo(
    () => (hierarchy ? filterGenresByQuery(hierarchy, debouncedValue) : []),
    [hierarchy, debouncedValue],
  );

  const shouldDefaultExpand =
    expandAll || Boolean(debouncedValue && debouncedValue.length > 0);

  const handleGenreSelect = (genre: GenreNode) => {
    const genreDoc = genreNodeToDocument(genre);
    if (selectedIds.has(genre.id)) {
      removeGenre(genre.id);
    } else {
      addGenre(genreDoc);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-accent size-8"
              size="icon"
            >
              <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            </Button>
          )}

          <h4 className="text-xl font-semibold">{t("entities.genres")}</h4>
        </div>

        {hierarchy && hierarchy.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandAll(!expandAll)}
          >
            {expandAll ? tCommon("collapse-all") : tCommon("expand-all")}
          </Button>
        )}
      </div>

      <div className="relative">
        {isLoading ? (
          <Spinner className="absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        ) : (
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        )}

        <Input
          placeholder={t("entities.search-for", {
            entity: t("entities.genres"),
          })}
          className="h-8 pl-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="size-6" />
          </div>
        ) : filteredHierarchy.length > 0 ? (
          filteredHierarchy.map((genre) => (
            <HierarchicalItem
              key={genre.id}
              genre={genre}
              depth={0}
              handleSelect={handleGenreSelect}
              selectedIds={selectedIds}
              searchQuery={debouncedValue}
              defaultExpanded={shouldDefaultExpand}
            />
          ))
        ) : (
          <div className="border-border flex w-full items-center justify-center rounded-md border py-8">
            <p className="text-muted-foreground text-sm">
              {t("entities.no-entity", { entity: t("entities.genres") })}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

const GenresFilter = () => {
  const t = useTranslations();
  const selectedGenres = useChatFilters((s) => s.selectedGenres);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterButton
          icon={FoldersIcon}
          label={t("entities.genre")}
          count={selectedGenres.length}
        />
      </PopoverTrigger>

      <PopoverContent className="flex max-h-100 w-100 flex-col gap-4 overflow-y-auto">
        <GenresFilterContent />
      </PopoverContent>
    </Popover>
  );
};

export default GenresFilter;
