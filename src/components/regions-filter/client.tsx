"use client";

import type { findAllRegionsWithBooksCount } from "@/server/services/regions";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import FilterContainer from "@/components/search-results/filter-container";
import { Button } from "@/components/ui/button";
import { usePathLocale } from "@/lib/locale/utils";
import { usePathname, useRouter } from "@/navigation";
import { getPrimaryLocalizedText } from "@/server/db/localization";
import Fuse from "fuse.js";
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
  regions: Awaited<ReturnType<typeof findAllRegionsWithBooksCount>>;
}

export default function RegionsFilterClient({
  currentRegions,
  regions,
}: RegionsFilterProps) {
  const t = useTranslations();
  const formatter = useFormatter();
  const pathLocale = usePathLocale();

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
    return new Fuse(regions, {
      keys: ["name", "arabicName", "currentName"],
      threshold: 0.3,
    });
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
      titleInfo={t("common.regions-filter-info")}
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
      <FilterContainer.Input
        placeholder={t("entities.search-for", { entity: t("entities.region") })}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* make font weight normal */}
      <FilterContainer.List className="font-inter mt-5">
        {matchedRegions.items.map((region) => {
          const booksCount = formatter.number(region.count);

          const name = getPrimaryLocalizedText(
            region.nameTranslations,
            pathLocale,
          );
          const title = `${name} (${booksCount})`;

          return (
            <FilterContainer.Checkbox
              key={region.slug}
              id={region.slug}
              checked={selectedRegions.includes(region.slug)}
              onCheckedChange={() => handleChange(region.slug)}
              title={title}
              count={booksCount}
            >
              {name}
            </FilterContainer.Checkbox>
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
      </FilterContainer.List>
    </FilterContainer>
  );
}
