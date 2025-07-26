"use client";

import { useMemo, useState } from "react";
import FilterContainer from "@/components/search-results/filter-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { findAllGenresWithBooksCount } from "@/lib/api/genres";
import { usePathLocale } from "@/lib/locale/utils";
import { usePathname } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useFormatter, useTranslations } from "next-intl";
import {
  createSerializer,
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from "nuqs";

const genresSerializer = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions({
    clearOnDefault: true,
    throttleMs: 300,
  });

export const useGenresFilter = () => {
  return useQueryState("genres", genresSerializer);
};

const serializer = createSerializer({
  genres: genresSerializer,
});

export default function GenresFilter({
  bookIds,
  isLoading,
}: {
  bookIds: string[];
  isLoading?: boolean;
}) {
  const t = useTranslations();
  const formatter = useFormatter();

  const locale = usePathLocale();
  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["genres", bookIds, locale],
    queryFn: () => findAllGenresWithBooksCount({ bookIds, locale }),
  });

  const [selectedGenres, setSelectedGenres] = useGenresFilter();

  const pathname = usePathname();
  const [size, setSize] = useState(10);

  const genreIdToGenreName = useMemo(() => {
    if (!genres) return {};
    return Object.fromEntries(genres.map((item) => [item.id, item]));
  }, [genres]);

  const index = useMemo(() => {
    return new Fuse(genres ?? [], {
      keys: ["id", "name"],
      threshold: 0.3,
    });
  }, [genres]);

  const [value, setValue] = useState("");

  const handleChange = (genre: string) => {
    let newSelectedGenres = [...selectedGenres];
    if (newSelectedGenres.includes(genre)) {
      newSelectedGenres = newSelectedGenres.filter((g) => g !== genre);
    } else {
      newSelectedGenres.push(genre);
    }
    void setSelectedGenres(newSelectedGenres);
  };

  const matchedGenres = useMemo(() => {
    const q = value.trim();
    const _genres = genres ?? [];
    const selectedGenresSet = new Set(selectedGenres);
    const selectedGenresArray = selectedGenres
      .map((g) => genreIdToGenreName[g])
      .filter(Boolean) as typeof _genres;

    if (!q) {
      const items = selectedGenresArray.concat(
        _genres.slice(0, size).filter((g) => !selectedGenresSet.has(g.id)),
      );

      return {
        items,
        hasMore: _genres.length > size,
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

  return (
    <FilterContainer
      title={t("entities.genres")}
      isLoading={isLoading || isLoadingGenres}
      clearFilterHref={
        selectedGenres.length > 0
          ? {
              pathname,
              query: serializer({ genres: [] }),
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
        {isLoadingGenres ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-20 max-w-full" />
              </div>
            ))}
          </>
        ) : (
          matchedGenres.items.map((genre) => {
            const booksCount = formatter.number(genre.numberOfBooks);

            const primaryText = genre.name;
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
          })
        )}

        {matchedGenres.hasMore && (
          <Button onClick={() => setSize((s) => s + 10)} variant="link">
            {t("common.load-more")}
          </Button>
        )}
      </FilterContainer.List>
    </FilterContainer>
  );
}
