"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/search-results/search-bar";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/lib/locale/utils";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export interface HierarchicalItem {
  id: string;
  slug: string;
  primaryName: string;
  secondaryName?: string;
  children?: HierarchicalItem[];
}

interface HierarchicalListViewProps<T extends HierarchicalItem> {
  hierarchy: T[];
  getHref: (item: T) => string | null;
  renderStats: (item: T) => ReactNode;
  searchQuery?: string;
  placeholder?: string;
  emptyMessage?: string;
}

interface ItemProps<T extends HierarchicalItem> {
  item: T;
  depth: number;
  defaultExpanded: boolean;
  getHref: (item: T) => string | null;
  renderStats: (item: T) => ReactNode;
}

function filterByQuery<T extends HierarchicalItem>(
  items: T[],
  query: string,
): T[] {
  if (!query) return items;

  const lowerQuery = query.toLowerCase();
  const filtered: T[] = [];

  for (const item of items) {
    const matchesName =
      item.primaryName.toLowerCase().includes(lowerQuery) ||
      (item.secondaryName &&
        item.secondaryName.toLowerCase().includes(lowerQuery));

    const filteredChildren = item.children
      ? filterByQuery(item.children as T[], query)
      : [];

    if (matchesName || filteredChildren.length > 0) {
      filtered.push({
        ...item,
        children:
          filteredChildren.length > 0 ? filteredChildren : item.children,
      });
    }
  }

  return filtered;
}

function ListItem<T extends HierarchicalItem>({
  item,
  depth,
  defaultExpanded,
  getHref,
  renderStats,
}: ItemProps<T>) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = item.children && item.children.length > 0;
  const direction = useDirection();

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "border-border hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-4 transition-colors select-none",
          depth > 0 && (direction === "rtl" ? "border-r-4" : "border-l-4"),
          hasChildren && isExpanded && "bg-muted/40",
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
          {(() => {
            const href = getHref(item);
            const content = (
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={cn(
                    "text-foreground text-base font-medium",
                    href && "group-hover:text-primary",
                  )}>
                    {item.primaryName}
                  </h3>
                  <span className="text-muted-foreground flex gap-3 text-xs whitespace-nowrap">
                    {renderStats(item)}
                  </span>
                </div>
                {item.secondaryName && (
                  <p className="text-muted-foreground text-sm">
                    {item.secondaryName}
                  </p>
                )}
              </div>
            );

            return href ? (
              <Link href={href} className="group block">
                {content}
              </Link>
            ) : (
              <div>{content}</div>
            );
          })()}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-2 flex flex-col gap-2">
          {item.children!.map((child) => (
            <ListItem
              key={child.id}
              item={child as T}
              depth={depth + 1}
              defaultExpanded={defaultExpanded}
              getHref={getHref}
              renderStats={renderStats}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HierarchicalListView<T extends HierarchicalItem>({
  hierarchy,
  getHref,
  renderStats,
  searchQuery = "",
  placeholder,
  emptyMessage,
}: HierarchicalListViewProps<T>) {
  const [expandAll, setExpandAll] = useState(false);
  const t = useTranslations("common");

  const filteredHierarchy = useMemo(
    () => filterByQuery(hierarchy, searchQuery),
    [hierarchy, searchQuery],
  );

  const shouldDefaultExpand =
    expandAll || Boolean(searchQuery && searchQuery.length > 0);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar defaultValue={searchQuery} placeholder={placeholder} />
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
          filteredHierarchy.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              depth={0}
              defaultExpanded={shouldDefaultExpand}
              getHref={getHref}
              renderStats={renderStats}
            />
          ))
        ) : (
          <div className="border-border flex w-full items-center justify-center rounded-md border py-8">
            <p className="text-muted-foreground text-sm">
              {emptyMessage ?? "No results found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
