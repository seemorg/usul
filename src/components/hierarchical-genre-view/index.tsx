"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/search-results/search-bar";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export interface HierarchicalGenre {
  id: string;
  slug: string;
  primaryName: string;
  secondaryName: string;
  numberOfBooks: number;
  children?: HierarchicalGenre[];
}

interface HierarchicalGenreViewProps {
  hierarchy: HierarchicalGenre[];
  searchQuery?: string;
  defaultExpandLevel?: number;
  placeholder?: string;
}

interface GenreItemProps {
  genre: HierarchicalGenre;
  depth: number;
  searchQuery?: string;
  defaultExpanded: boolean;
}

function filterGenresByQuery(
  genres: HierarchicalGenre[],
  query: string,
): HierarchicalGenre[] {
  if (!query) return genres;

  const lowerQuery = query.toLowerCase();

  const filtered: HierarchicalGenre[] = [];

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

function GenreItem({
  genre,
  depth,
  searchQuery,
  defaultExpanded,
}: GenreItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = genre.children && genre.children.length > 0;
  const t = useTranslations("entities");
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

        <div className="min-w-0 flex-1">
          <Link
            href={navigation.genres.bySlug(genre.slug)}
            className="group block"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-foreground group-hover:text-primary text-base font-medium">
                  {genre.primaryName}
                </h3>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {t("x-texts", { count: genre.numberOfBooks })}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {genre.secondaryName}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-2 flex flex-col gap-2">
          {genre.children!.map((child) => (
            <GenreItem
              key={child.id}
              genre={child}
              depth={depth + 1}
              searchQuery={searchQuery}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HierarchicalGenreView({
  hierarchy,
  searchQuery = "",
  placeholder,
}: HierarchicalGenreViewProps) {
  const [expandAll, setExpandAll] = useState(false);
  const t = useTranslations("common");
  const tEntities = useTranslations("entities");

  const filteredHierarchy = useMemo(
    () => filterGenresByQuery(hierarchy, searchQuery),
    [hierarchy, searchQuery],
  );

  const shouldDefaultExpand =
    expandAll || Boolean(searchQuery && searchQuery.length > 0);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar
            defaultValue={searchQuery}
            placeholder={
              placeholder ??
              tEntities("search-within", { entity: tEntities("genres") })
            }
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpandAll(!expandAll)}
          className="w-full sm:w-auto"
        >
          {expandAll ? t("collapse-all") : t("expand-all")}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {filteredHierarchy.length > 0 ? (
          filteredHierarchy.map((genre) => (
            <GenreItem
              key={genre.id}
              genre={genre}
              depth={0}
              searchQuery={searchQuery}
              defaultExpanded={shouldDefaultExpand}
            />
          ))
        ) : (
          <div className="border-border flex w-full items-center justify-center rounded-md border py-8">
            <p className="text-muted-foreground text-sm">
              No genres found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
