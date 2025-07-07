import type { AuthorDocument } from "@/types/author";
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
import { searchAuthors } from "@/lib/api/search";
import { formatDeathYear } from "@/lib/date";
import { usePathLocale } from "@/lib/locale/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, SearchIcon, UserPenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebounceValue } from "usehooks-ts";

import FilterPagination from "./filter-pagination";
import { FilterButton } from "./utils";

const Item = ({
  author,
  handleSelect,
  isSelected,
}: {
  author: AuthorDocument;
  handleSelect: () => void;
  isSelected: boolean;
}) => {
  const t = useTranslations();
  const locale = usePathLocale();

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        className="size-6"
        id={`${author.id}-author-filter`}
        checked={isSelected}
        onCheckedChange={handleSelect}
      />

      <Label htmlFor={`${author.id}-author-filter`}>
        <div>
          <p className="font-semibold">
            {author.primaryName} {formatDeathYear(author.year, locale)}
          </p>
          <p className="text-muted-foreground text-sm">
            {t("entities.x-texts", { count: author.booksCount })}
          </p>
        </div>
      </Label>
    </div>
  );
};

export function AuthorsFilterContent({ onBack }: { onBack?: () => void }) {
  const t = useTranslations();
  const locale = usePathLocale();
  const selectedAuthors = useChatFilters((s) => s.selectedAuthors);
  const addAuthor = useChatFilters((s) => s.addAuthor);
  const removeAuthor = useChatFilters((s) => s.removeAuthor);

  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 300);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "author-search",
      debouncedValue,
      { page: currentPage, locale },
    ] as const,
    queryFn: ({
      queryKey: [, debouncedValue, { page: currentPage, locale }],
    }) =>
      searchAuthors(debouncedValue, {
        limit: 10,
        page: currentPage,
        locale,
      }),
  });

  const selectedIds = selectedAuthors.map((a) => a.id);
  const handleAuthorSelect = (author: AuthorDocument) => {
    if (selectedIds.includes(author.id)) {
      removeAuthor(author.id);
    } else {
      addAuthor(author);
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
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
          </Button>
        )}

        <h4 className="text-xl font-semibold">{t("entities.authors")}</h4>
      </div>

      <div className="relative">
        {isLoading ? (
          <Spinner className="absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        ) : (
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        )}

        <Input
          placeholder={t("chat.filters.find_authors")}
          className="h-8 pl-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        {selectedAuthors.map((author) => (
          <Item
            key={author.id}
            author={author}
            handleSelect={() => handleAuthorSelect(author)}
            isSelected={true}
          />
        ))}

        {data?.results.hits.map((author) => {
          if (selectedIds.includes(author.id)) return null;

          return (
            <Item
              key={author.id}
              author={author}
              handleSelect={() => handleAuthorSelect(author)}
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

const AuthorsFilter = () => {
  const t = useTranslations();
  const selectedAuthors = useChatFilters((s) => s.selectedAuthors);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterButton
          icon={UserPenIcon}
          label={t("entities.author")}
          count={selectedAuthors.length}
        />
      </PopoverTrigger>

      <PopoverContent className="flex max-h-100 w-100 flex-col gap-4 overflow-y-auto">
        <AuthorsFilterContent />
      </PopoverContent>
    </Popover>
  );
};

export default AuthorsFilter;
