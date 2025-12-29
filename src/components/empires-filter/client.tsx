"use client";

import type { findAllEmpiresWithBooksCount } from "@/lib/api/empires";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import FilterContainer from "@/components/search-results/filter-container";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/navigation";
import Fuse from "fuse.js";
import { useFormatter, useTranslations } from "next-intl";

const DEBOUNCE_DELAY = 300;

const getEmpireFilterUrlParams = (
  empires: string[],
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);

  if (params.has("page")) {
    params.delete("page");
  }

  if (empires.length > 0) {
    params.set("empires", empires.join(","));
  } else {
    params.delete("empires");
  }

  return params;
};

interface EmpiresFilterProps {
  currentEmpires: string[];
  empires: Awaited<ReturnType<typeof findAllEmpiresWithBooksCount>>;
  countType?: "books" | "authors";
}

export default function EmpiresFilterClient({
  currentEmpires,
  empires,
  countType = "books",
}: EmpiresFilterProps) {
  const t = useTranslations();
  const formatter = useFormatter();

  const [selectedEmpires, setSelectedEmpires] =
    useState<string[]>(currentEmpires);

  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const slugToEmpire = useMemo(() => {
    return Object.fromEntries(empires.map((r) => [r.slug, r])) as Record<
      string,
      (typeof empires)[number]
    >;
  }, [empires]);

  const index = useMemo(() => {
    return new Fuse(empires, {
      keys: ["name", "arabicName", "currentName"],
      threshold: 0.3,
    });
  }, [empires]);

  const [value, setValue] = useState("");
  const [size, setSize] = useState(10);

  useEffect(() => {
    setSelectedEmpires(currentEmpires);
  }, [currentEmpires]);

  const handleChange = (empireSlug: string) => {
    let newSelectedEmpires = [...selectedEmpires];

    if (newSelectedEmpires.includes(empireSlug)) {
      newSelectedEmpires = newSelectedEmpires.filter((g) => g !== empireSlug);
    } else {
      newSelectedEmpires.push(empireSlug);
    }

    setSelectedEmpires(newSelectedEmpires);

    const params = getEmpireFilterUrlParams(newSelectedEmpires, searchParams);

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

  const matchedEmpires = useMemo(() => {
    const q = value.trim();

    const selectedEmpiresItems = selectedEmpires.map(
      (slug) => slugToEmpire[slug],
    ) as typeof empires;
    const selectedEmpiresSet = new Set(selectedEmpires);

    if (!q) {
      const items = selectedEmpiresItems.concat(
        empires.slice(0, size).filter((r) => !selectedEmpiresSet.has(r.slug)),
      );

      return {
        items,
        hasMore: empires.length > size,
      };
    }

    const matches = index.search(q, { limit: size }).map((r) => r.item);
    const items = selectedEmpiresItems.concat(
      matches.filter((match) => !selectedEmpiresSet.has(match.slug)),
    );

    return {
      items,
      hasMore: matches.length === size,
    };
  }, [empires, slugToEmpire, value, index, size, selectedEmpires]);

  return (
    <FilterContainer
      title={t("entities.empires")}
      isLoading={isPending}
      clearFilterHref={
        selectedEmpires.length > 0
          ? {
              pathname,
              query: getEmpireFilterUrlParams([], searchParams).toString(),
            }
          : undefined
      }
    >
      <FilterContainer.Input
        placeholder={t("entities.search-for", { entity: t("entities.empire") })}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* make font weight normal */}
      <FilterContainer.List className="font-inter mt-5">
        {matchedEmpires.items.map((empire) => {
          const count = formatter.number(
            countType === "books"
              ? empire.numberOfBooks
              : empire.numberOfAuthors,
          );

          const name = empire.name;
          const title = `${name} (${count})`;

          return (
            <FilterContainer.Checkbox
              key={empire.slug}
              id={empire.slug}
              checked={selectedEmpires.includes(empire.slug)}
              onCheckedChange={() => handleChange(empire.slug)}
              title={title}
              count={count}
            >
              {name}
            </FilterContainer.Checkbox>
          );
        })}

        {matchedEmpires.hasMore && (
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
