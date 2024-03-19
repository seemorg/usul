"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import FilterContainer from "@/components/search-results/filter-container";
import { usePathname, useRouter } from "@/navigation";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";

const DEBOUNCE_DELAY = 300;

const getRegionFilterUrlParams = (
  regions: string[],
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);

  if (params.has("page")) {
    params.delete("page");
  }

  if (regions.length > 0) {
    params.set("regions", regions.join(","));
  } else {
    params.delete("regions");
  }

  return params;
};

interface RegionsFilterProps {
  currentRegions: string[];
  regions: { name: string; slug: string; count: number }[];
}

export default function _RegionsFilter({
  currentRegions,
  regions,
}: RegionsFilterProps) {
  const t = useTranslations();
  const formatter = useFormatter();
  const [selectedRegions, setSelectedRegions] =
    useState<string[]>(currentRegions);

  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const slugToRegion = useMemo(() => {
    return Object.fromEntries(regions.map((r) => [r.slug, r])) as Record<
      string,
      (typeof regions)[number]
    >;
  }, [regions]);

  const index = useMemo(() => {
    return new Fuse(
      Object.values(regions).map((r) => ({
        name: r.name,
        slug: r.slug,
        count: r.count,
      })),
      {
        keys: ["name"],
        threshold: 0.3,
        includeScore: true,
      },
    );
  }, [regions]);

  const [value, setValue] = useState("");
  const [size, setSize] = useState(10);

  useEffect(() => {
    setSelectedRegions(currentRegions);
  }, [currentRegions]);

  const handleChange = (regionSlug: string) => {
    let newSelectedGeographies = [...selectedRegions];

    if (newSelectedGeographies.includes(regionSlug)) {
      newSelectedGeographies = newSelectedGeographies.filter(
        (g) => g !== regionSlug,
      );
    } else {
      newSelectedGeographies.push(regionSlug);
    }

    setSelectedRegions(newSelectedGeographies);

    const params = getRegionFilterUrlParams(
      newSelectedGeographies,
      searchParams,
    );

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, DEBOUNCE_DELAY);

    // @ts-ignore
    timeoutRef.current = newTimeout;
  };

  const matchedRegions = useMemo(() => {
    const q = value.trim();

    const selectedGeographiesItems = selectedRegions.map(
      (slug) => slugToRegion[slug],
    ) as typeof regions;
    const selectedGeographiesSet = new Set(selectedRegions);

    if (!q) {
      const items = selectedGeographiesItems.concat(
        regions
          .slice(0, size)
          .filter((r) => !selectedGeographiesSet.has(r.slug)),
      );

      return {
        items,
        hasMore: regions.length > size,
      };
    }

    const matches = index.search(q, { limit: size }).map((r) => r.item);
    const items = selectedGeographiesItems.concat(
      matches.filter((match) => !selectedGeographiesSet.has(match.slug)),
    );

    return {
      items,
      hasMore: matches.length === size,
    };
  }, [regions, slugToRegion, value, index, size, selectedRegions]);

  return (
    <FilterContainer
      title={t("entities.regions")}
      isLoading={isPending}
      clearFilterHref={
        selectedRegions.length > 0
          ? {
              pathname,
              query: getRegionFilterUrlParams([], searchParams).toString(),
            }
          : undefined
      }
    >
      <Input
        placeholder={t("entities.search-for", { entity: t("entities.region") })}
        className="border border-gray-300 bg-white shadow-none dark:border-border dark:bg-transparent"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* make font weight normal */}
      <div className="font-inter mt-5 max-h-[300px] w-full space-y-3 overflow-y-scroll sm:max-h-none sm:overflow-y-auto">
        {matchedRegions.items.map((region) => {
          const booksCount = formatter.number(region.count);
          const title = `${region.name} (${booksCount})`;

          return (
            <div key={region.slug} className="flex items-center gap-2">
              <Checkbox
                id={region.slug}
                checked={selectedRegions.includes(region.slug)}
                onCheckedChange={() => handleChange(region.slug)}
                className="h-4 w-4"
              />

              <label
                htmlFor={region.slug}
                className="flex w-full items-center justify-between text-sm"
                title={title}
              >
                <span className="line-clamp-1 min-w-0 max-w-[70%] break-words">
                  {region.name}
                </span>

                <span className="rounded-md px-1.5 py-0.5 text-xs text-gray-600">
                  {booksCount}
                </span>
              </label>
            </div>
          );
        })}

        {matchedRegions.hasMore && (
          <Button
            variant="link"
            onClick={() => {
              setSize((prev) => prev + 10);
            }}
          >
            {t("common.load-more")}
          </Button>
        )}
      </div>
    </FilterContainer>
  );
}
