"use client";

import type { GenreNode } from "@/types/genre";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import FilterContainer from "@/components/search-results/filter-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/navigation";
import Fuse from "fuse.js";
import { useFormatter, useTranslations } from "next-intl";

const DEBOUNCE_DELAY = 300;

interface GenresFilterProps {
  currentGenres: string[];
  hierarchy: GenreNode[];
}

const getGenresFilterUrlParams = (
  genres: string[],
  searchParams: ReadonlyURLSearchParams,
  parentToChildren: Map<string, string[]>,
) => {
  const params = new URLSearchParams(searchParams);

  // make sure to reset pagination state
  if (params.has("page")) {
    params.delete("page");
  }

  // Filter out parents when their children are selected
  const selectedIds = new Set(genres);
  const filteredGenres = genres.filter((genreId) => {
    const children = parentToChildren.get(genreId);
    if (!children || children.length === 0) {
      // Not a parent, include it
      return true;
    }

    // Check if any child is selected
    const hasSelectedChild = children.some((childId) =>
      selectedIds.has(childId),
    );

    // Exclude parent if it has selected children
    return !hasSelectedChild;
  });

  if (filteredGenres.length > 0) {
    params.set("genres", filteredGenres.join(","));
  } else {
    params.delete("genres");
  }

  return params;
};

// Flatten hierarchy for search
function flattenHierarchy(nodes: GenreNode[]): GenreNode[] {
  const result: GenreNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children) {
      result.push(...flattenHierarchy(node.children));
    }
  }
  return result;
}

// Get all descendant IDs recursively
function getAllDescendantIds(node: GenreNode): string[] {
  const result: string[] = [];
  if (node.children) {
    for (const child of node.children) {
      result.push(child.id);
      result.push(...getAllDescendantIds(child));
    }
  }
  return result;
}

export default function GenresFilterClient({
  currentGenres,
  hierarchy,
}: GenresFilterProps) {
  const t = useTranslations();
  const formatter = useFormatter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentGenres);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set(),
  );

  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [size, setSize] = useState(10);

  // Flatten hierarchy for search
  const allGenres = useMemo(() => flattenHierarchy(hierarchy), [hierarchy]);

  // Create maps for quick lookup
  const genreIdToGenre = useMemo(() => {
    const map = new Map<string, GenreNode>();
    const traverse = (nodes: GenreNode[]) => {
      for (const node of nodes) {
        map.set(node.id, node);
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(hierarchy);
    return map;
  }, [hierarchy]);

  const parentIdToChildren = useMemo(() => {
    const map = new Map<string, GenreNode[]>();
    const traverse = (nodes: GenreNode[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          map.set(node.id, node.children);
          traverse(node.children);
        }
      }
    };
    traverse(hierarchy);
    return map;
  }, [hierarchy]);

  // Map parent ID to children IDs (for filtering)
  const parentIdToChildrenIds = useMemo(() => {
    const map = new Map<string, string[]>();
    parentIdToChildren.forEach((children, parentId) => {
      map.set(
        parentId,
        children.map((child) => child.id),
      );
    });
    return map;
  }, [parentIdToChildren]);

  const childIdToParentId = useMemo(() => {
    const map = new Map<string, string>();
    const traverse = (nodes: GenreNode[], parentId?: string) => {
      for (const node of nodes) {
        if (parentId) {
          map.set(node.id, parentId);
        }
        if (node.children) {
          traverse(node.children, node.id);
        }
      }
    };
    traverse(hierarchy);
    return map;
  }, [hierarchy]);

  // Search index
  const index = useMemo(() => {
    return new Fuse(allGenres, {
      keys: ["id", "name"],
      threshold: 0.3,
    });
  }, [allGenres]);

  const [value, setValue] = useState("");

  useEffect(() => {
    setSelectedGenres(currentGenres);
    // If clearing all genres, reset expanded state to default
    if (currentGenres.length === 0) {
      setExpandedParents(new Set());
    } else {
      // Auto-expand only direct parents that have selected children
      // Preserve existing expanded state and only add new parents
      setExpandedParents((prev) => {
        const newExpanded = new Set(prev);
        for (const genreId of currentGenres) {
          const parentId = childIdToParentId.get(genreId);
          if (parentId) {
            newExpanded.add(parentId);
          }
        }
        return newExpanded;
      });
    }
  }, [currentGenres, childIdToParentId]);

  const handleChange = (genreId: string) => {
    let newSelectedGenres = [...selectedGenres];
    const genre = genreIdToGenre.get(genreId);
    const hasChildren = genre?.children && genre.children.length > 0;

    if (newSelectedGenres.includes(genreId)) {
      // Unchecking: remove this genre and all its descendants
      newSelectedGenres = newSelectedGenres.filter((g) => g !== genreId);

      // If this is a parent, remove all its children and descendants
      if (hasChildren && genre) {
        const descendantIds = getAllDescendantIds(genre);
        newSelectedGenres = newSelectedGenres.filter(
          (g) => !descendantIds.includes(g),
        );
      }

      // Unexpand the parent
      setExpandedParents((prev) => {
        const newExpanded = new Set(prev);
        newExpanded.delete(genreId);
        return newExpanded;
      });
    } else {
      // Checking: add this genre
      newSelectedGenres.push(genreId);

      // If this is a child, remove its parent if it exists in selectedGenres
      // (we want to show parent with gray checkmark, not as selected)
      const parentId = childIdToParentId.get(genreId);
      if (parentId && newSelectedGenres.includes(parentId)) {
        newSelectedGenres = newSelectedGenres.filter((g) => g !== parentId);
      }

      // If this is a parent, remove all its children from selectedGenres
      // (when parent is selected, we don't want children selected)
      if (hasChildren && genre) {
        const childrenIds = genre.children!.map((c) => c.id);
        newSelectedGenres = newSelectedGenres.filter(
          (g) => !childrenIds.includes(g),
        );
      }

      // If this is a parent with children, expand it to show direct children
      if (hasChildren) {
        setExpandedParents((prev) => new Set(prev).add(genreId));
      }
      // Auto-expand only direct parent if this is a child
      if (parentId) {
        setExpandedParents((prev) => new Set(prev).add(parentId));
      }
    }
    setSelectedGenres(newSelectedGenres);

    const params = getGenresFilterUrlParams(
      newSelectedGenres,
      searchParams,
      parentIdToChildrenIds,
    );

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, DEBOUNCE_DELAY);

    timeoutRef.current = newTimeout;
  };

  // Build display list with hierarchy
  const displayItems = useMemo(() => {
    const q = value.trim();
    const selectedGenresSet = new Set(selectedGenres);
    const result: Array<{ genre: GenreNode; level: number; isChild: boolean }> =
      [];

    if (q) {
      // Search mode: show flat results
      const matches = index.search(q, { limit: size }).map((r) => r.item);
      const selectedGenresArray = selectedGenres
        .map((g) => genreIdToGenre.get(g))
        .filter(Boolean) as GenreNode[];

      const items = selectedGenresArray.concat(
        matches.filter((g) => !selectedGenresSet.has(g.id)),
      );

      return items.map((genre) => ({ genre, level: 0, isChild: false }));
    }

    // Hierarchy mode: show parents and expanded children (only one level at a time)
    const traverse = (nodes: GenreNode[], level: number = 0) => {
      for (const node of nodes) {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedParents.has(node.id);

        // Always show the current node
        result.push({ genre: node, level, isChild: level > 0 });

        // Only show direct children if this node is expanded
        // Don't recursively expand - each parent must be expanded separately
        if (hasChildren && isExpanded) {
          traverse(node.children!, level + 1);
        }
      }
    };

    traverse(hierarchy);

    // Limit results
    return result.slice(0, size);
  }, [
    value,
    index,
    size,
    selectedGenres,
    hierarchy,
    expandedParents,
    genreIdToGenre,
  ]);

  const hasMore = useMemo(() => {
    if (value.trim()) {
      const matches = index.search(value.trim(), { limit: size + 1 });
      return matches.length > size;
    }
    // Count all items in hierarchy
    const countAll = (nodes: GenreNode[]): number => {
      let count = 0;
      for (const node of nodes) {
        count++;
        if (node.children) {
          count += countAll(node.children);
        }
      }
      return count;
    };
    return countAll(hierarchy) > size;
  }, [value, index, size, hierarchy]);

  return (
    <FilterContainer
      title={t("entities.genres")}
      isLoading={isPending}
      clearFilterHref={
        selectedGenres.length > 0
          ? {
              pathname,
              query: getGenresFilterUrlParams(
                [],
                searchParams,
                parentIdToChildrenIds,
              ).toString(),
            }
          : undefined
      }
    >
      <FilterContainer.Input
        placeholder={t("entities.search-for", { entity: t("entities.genre") })}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <FilterContainer.List className="mt-5">
        {displayItems.map(({ genre, level, isChild }) => {
          const primaryText = genre.primaryName;
          const hasBooks = genre.numberOfBooks > 0;
          const booksCount = hasBooks
            ? formatter.number(genre.numberOfBooks)
            : "";
          const title = hasBooks
            ? `${primaryText} (${booksCount})`
            : primaryText;

          // Calculate margin based on level: each level gets ml-2
          // Level 0: no margin, Level 1: ml-2, Level 2: ml-4, Level 3: ml-6, etc.
          const marginClassMap: Record<number, string> = {
            1: "ml-2",
            2: "ml-4",
            3: "ml-6",
            4: "ml-8",
            5: "ml-10",
          };
          const marginClass = marginClassMap[level] || "";

          // Check if this is a parent with selected children (for gray checkmark)
          const children = parentIdToChildren.get(genre.id);
          const selectedIdsSet = new Set(selectedGenres);
          const isParentWithSelectedChildren =
            children &&
            children.length > 0 &&
            children.some((child) => selectedIdsSet.has(child.id)) &&
            !selectedIdsSet.has(genre.id);

          const isSelected = selectedGenres.includes(genre.id);
          const showGrayCheckmark = isParentWithSelectedChildren;

          return (
            <div key={genre.id}>
              <div className={cn("flex items-center gap-2", marginClass)}>
                <div className="flex-1">
                  <FilterContainer.Checkbox
                    id={genre.id}
                    title={title}
                    count={hasBooks ? booksCount : undefined}
                    checked={isSelected || showGrayCheckmark}
                    onCheckedChange={() => handleChange(genre.id)}
                    className={
                      showGrayCheckmark
                        ? "h-4 w-4 data-[state=checked]:!bg-gray-400 data-[state=checked]:!text-white"
                        : "h-4 w-4"
                    }
                  >
                    {primaryText}
                  </FilterContainer.Checkbox>
                </div>
              </div>
            </div>
          );
        })}

        {hasMore && (
          <Button onClick={() => setSize((s) => s + 10)} variant="link">
            {t("common.load-more")}
          </Button>
        )}
      </FilterContainer.List>
    </FilterContainer>
  );
}
