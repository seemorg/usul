import type { BookDocument } from "@/types/book";
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
import { searchBooks } from "@/lib/api/search";
import { formatDeathYear } from "@/lib/date";
import { usePathLocale } from "@/lib/locale/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, LibraryBigIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebounceValue } from "usehooks-ts";

import FilterPagination from "./filter-pagination";
import { FilterButton } from "./utils";

const Item = ({
  book,
  handleBookSelect,
  isSelected,
}: {
  book: BookDocument;
  handleBookSelect: () => void;
  isSelected: boolean;
}) => {
  const locale = usePathLocale();

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        className="size-6"
        id={`${book.id}-text-filter`}
        checked={isSelected}
        onCheckedChange={handleBookSelect}
      />

      <Label htmlFor={`${book.id}-text-filter`}>
        <div>
          <p className="font-semibold">{book.primaryName}</p>
          <p className="text-muted-foreground text-sm">
            {book.author.primaryName}{" "}
            {formatDeathYear(book.author.year, locale)}
          </p>
        </div>
      </Label>
    </div>
  );
};

export function TextsFilterContent({ onBack }: { onBack?: () => void }) {
  const t = useTranslations();
  const locale = usePathLocale();
  const selectedBooks = useChatFilters((s) => s.selectedBooks);
  const addBook = useChatFilters((s) => s.addBook);
  const removeBook = useChatFilters((s) => s.removeBook);

  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 300);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "book-search",
      debouncedValue,
      { page: currentPage, locale },
    ] as const,
    queryFn: ({
      queryKey: [, debouncedValue, { page: currentPage, locale }],
    }) =>
      searchBooks(debouncedValue, {
        limit: 10,
        page: currentPage,
        locale,
      }),
  });

  const selectedIds = selectedBooks.map((b) => b.id);
  const handleBookSelect = (book: BookDocument) => {
    if (selectedIds.includes(book.id)) {
      removeBook(book.id);
    } else {
      addBook(book);
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
        <h4 className="text-xl font-semibold">{t("entities.texts")}</h4>
      </div>

      <div className="relative">
        {isLoading ? (
          <Spinner className="absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        ) : (
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        )}

        <Input
          placeholder="Find texts"
          className="h-8 pl-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        {selectedBooks.map((book) => (
          <Item
            key={book.id}
            book={book}
            handleBookSelect={() => handleBookSelect(book)}
            isSelected={true}
          />
        ))}

        {data?.results.hits.map((book) => {
          if (selectedIds.includes(book.id)) return null;

          return (
            <Item
              key={book.id}
              book={book}
              handleBookSelect={() => handleBookSelect(book)}
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

const TextsFilter = () => {
  const t = useTranslations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterButton icon={LibraryBigIcon} label={t("entities.text")} />
      </PopoverTrigger>

      <PopoverContent className="flex max-h-96 w-100 flex-col gap-4 overflow-y-auto">
        <TextsFilterContent />
      </PopoverContent>
    </Popover>
  );
};

export default TextsFilter;
