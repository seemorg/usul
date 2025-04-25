"use client";

import type { findAllGenresWithBooksCount } from "@/server/services/genres";
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

interface GenresFilterProps {
  currentGenres: string[];
  genres: Awaited<ReturnType<typeof findAllGenresWithBooksCount>>;
}

const getGenresFilterUrlParams = (
  genres: string[],
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);

  // make sure to reset pagination state
  if (params.has("page")) {
    params.delete("page");
  }

  if (genres.length > 0) {
    params.set("genres", genres.join(","));
  } else {
    params.delete("genres");
  }

  return params;
};

export default function GenresFilterClient({
  currentGenres,
  genres,
}: GenresFilterProps) {
  const t = useTranslations();
  const formatter = useFormatter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentGenres);

  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [size, setSize] = useState(10);
  const locale = usePathLocale();

  const genreIdToGenreName = useMemo(() => {
    return Object.fromEntries(genres.map((item) => [item.id, item]));
  }, [genres]);

  const index = useMemo(() => {
    return new Fuse(genres, {
      keys: ["id", "name"],
      threshold: 0.3,
    });
  }, [genres]);

  const [value, setValue] = useState("");

  useEffect(() => {
    setSelectedGenres(currentGenres);
  }, [currentGenres]);

  const handleChange = (genre: string) => {
    let newSelectedGenres = [...selectedGenres];
    if (newSelectedGenres.includes(genre)) {
      newSelectedGenres = newSelectedGenres.filter((g) => g !== genre);
    } else {
      newSelectedGenres.push(genre);
    }
    setSelectedGenres(newSelectedGenres);

    const params = getGenresFilterUrlParams(newSelectedGenres, searchParams);

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

  const matchedGenres = useMemo(() => {
    const q = value.trim();
    const selectedGenresSet = new Set(selectedGenres);
    const selectedGenresArray = selectedGenres
      .map((g) => genreIdToGenreName[g])
      .filter(Boolean) as typeof genres;

    if (!q) {
      const items = selectedGenresArray.concat(
        genres.slice(0, size).filter((g) => !selectedGenresSet.has(g.id)),
      );

      return {
        items,
        hasMore: genres.length > size,
      };
    }

    const matches = index.search(q, { limit: size }).map((r) => r.item);
    const items = selectedGenresArray.concat(
      matches.filter((g) => !selectedGenresSet.has(g.id)),
    );

    return {
      items,
      hasMore: matches.length === size,
    };
  }, [value, index, size, selectedGenres, genreIdToGenreName, genres]);

  // const genreIdToBooksCount = useMemo(() => {
  //   return Object.fromEntries(
  //     genres.map((item) => [item.genreId, item.booksCount]),
  //   );
  // }, [genres]);

  return (
    <FilterContainer
      title={t("entities.genres")}
      isLoading={isPending}
      clearFilterHref={
        selectedGenres.length > 0
          ? {
              pathname,
              query: getGenresFilterUrlParams([], searchParams).toString(),
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
        {matchedGenres.items.map((genre) => {
          // const count = genreIdToBooksCount[genre.genreId.toLowerCase()] ?? 0;
          const booksCount = formatter.number(genre._count.books);

          const primaryText = getPrimaryLocalizedText(
            genre.nameTranslations,
            locale,
          );
          const title = `${primaryText} (${booksCount})`;

          return (
            <FilterContainer.Checkbox
              key={genre.id}
              id={genre.id}
              title={title}
              count={booksCount}
              checked={selectedGenres.includes(genre.id)}
              onCheckedChange={() => handleChange(genre.id)}
            >
              {primaryText}
            </FilterContainer.Checkbox>
          );
        })}

        {matchedGenres.hasMore && (
          <Button onClick={() => setSize((s) => s + 10)} variant="link">
            {t("common.load-more")}
          </Button>
        )}
      </FilterContainer.List>
    </FilterContainer>
  );
}
