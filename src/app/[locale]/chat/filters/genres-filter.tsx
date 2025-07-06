import type { GenreDocument } from "@/types/genre";
import { useState } from "react";
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
import { searchGenres } from "@/lib/api/search";
import { usePathLocale } from "@/lib/locale/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, SearchIcon, TagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebounceValue } from "usehooks-ts";

import FilterPagination from "./filter-pagination";
import { FilterButton } from "./utils";

const Item = ({
  genre,
  handleSelect,
  isSelected,
}: {
  genre: GenreDocument;
  handleSelect: () => void;
  isSelected: boolean;
}) => {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        className="size-6"
        id={`${genre.id}-genre-filter`}
        checked={isSelected}
        onCheckedChange={handleSelect}
      />

      <Label htmlFor={`${genre.id}-genre-filter`}>
        <div>
          <p className="font-semibold">{genre.primaryName}</p>
          <p className="text-muted-foreground text-sm">
            {t("entities.x-texts", { count: genre.booksCount })}
          </p>
        </div>
      </Label>
    </div>
  );
};

export function GenresFilterContent({ onBack }: { onBack?: () => void }) {
  const t = useTranslations();
  const locale = usePathLocale();
  const selectedGenres = useChatFilters((s) => s.selectedGenres);
  const addGenre = useChatFilters((s) => s.addGenre);
  const removeGenre = useChatFilters((s) => s.removeGenre);

  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 300);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "genre-search",
      debouncedValue,
      { page: currentPage, locale },
    ] as const,
    queryFn: ({
      queryKey: [, debouncedValue, { page: currentPage, locale }],
    }) =>
      searchGenres(debouncedValue, {
        limit: 10,
        page: currentPage,
        locale,
      }),
  });

  const selectedIds = selectedGenres.map((g) => g.id);
  const handleGenreSelect = (genre: GenreDocument) => {
    if (selectedIds.includes(genre.id)) {
      removeGenre(genre.id);
    } else {
      addGenre(genre);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-accent size-8"
            size="icon"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
        )}

        <h4 className="text-xl font-semibold">{t("entities.genres")}</h4>
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
        {selectedGenres.map((genre) => (
          <Item
            key={genre.id}
            genre={genre}
            handleSelect={() => handleGenreSelect(genre)}
            isSelected={true}
          />
        ))}

        {data?.results.hits.map((genre) => {
          if (selectedIds.includes(genre.id)) return null;

          return (
            <Item
              key={genre.id}
              genre={genre}
              handleSelect={() => handleGenreSelect(genre)}
              isSelected={false}
            />
          );
        })}
      </div>

      <FilterPagination
        pagination={data?.pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
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
          icon={TagIcon}
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
