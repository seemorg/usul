"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "@/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import FilterContainer from "@/components/search-results/filter-container";
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";

const DEBOUNCE_DELAY = 300;

interface GenresFilterProps {
  currentGenres: string[];
  genres: { genreId: string; genreName: string; booksCount: number }[];
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

export default function _GenresFilter({
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

  const genreIdToGenreName = useMemo(() => {
    return Object.fromEntries(genres.map((item) => [item.genreId, item]));
  }, [genres]);

  const index = useMemo(() => {
    return new Fuse(
      genres.map((g) => ({
        genreId: g.genreId,
        genreName: g.genreName,
        booksCount: g.booksCount,
      })),
      {
        keys: ["genreId"],
        threshold: 0.3,
      },
    );
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
        genres.slice(0, size).filter((g) => !selectedGenresSet.has(g.genreId)),
      );

      return {
        items,
        hasMore: genres.length > size,
      };
    }

    const matches = index.search(q, { limit: size }).map((r) => r.item);
    const items = selectedGenresArray.concat(
      matches.filter((g) => !selectedGenresSet.has(g.genreId)),
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
      <Input
        placeholder={t("entities.search-for", { entity: t("entities.genre") })}
        className="border border-gray-300 bg-white shadow-none dark:border-border dark:bg-transparent"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="mt-5 max-h-[300px] w-full space-y-3 overflow-y-scroll text-sm sm:max-h-none sm:overflow-y-auto">
        {matchedGenres.items.map((genre) => {
          // const count = genreIdToBooksCount[genre.genreId.toLowerCase()] ?? 0;
          const booksCount = formatter.number(genre.booksCount);

          const title = `${genre.genreName} (${booksCount})`;

          return (
            <div
              key={genre.genreId}
              className="flex cursor-pointer items-center gap-2"
            >
              <Checkbox
                id={genre.genreId}
                checked={selectedGenres.includes(genre.genreId)}
                onCheckedChange={() => handleChange(genre.genreId)}
                className="h-4 w-4"
              />

              <label
                htmlFor={genre.genreId}
                className="flex w-full items-center justify-between text-sm"
                title={title}
              >
                <span className="line-clamp-1 min-w-0 max-w-[70%] break-words">
                  {genre.genreName}
                </span>

                <span className="rounded-md px-1.5 py-0.5 text-xs text-gray-600">
                  {booksCount}
                </span>
              </label>
            </div>
          );
        })}

        {matchedGenres.hasMore && (
          <Button onClick={() => setSize((s) => s + 10)} variant="link">
            {t("common.load-more")}
          </Button>
        )}
      </div>
    </FilterContainer>
  );
}
