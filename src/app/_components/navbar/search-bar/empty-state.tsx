/* eslint-disable react/jsx-key */
import DottedList from "@/components/ui/dotted-list";
import { useSearchHistoryStore } from "@/stores/search-history";
import { TrendingUpIcon } from "lucide-react";

const SearchPill = ({
  children,
  showIcon = false,
  onClick,
}: {
  children: React.ReactNode;
  showIcon?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
      onClick={onClick}
    >
      {showIcon && <TrendingUpIcon className="size-4" />}
      {children}
    </button>
  );
};

const popularSearches = ["Fiqh", "مواقيت الصلاة", "Al-Rissala", "Ibn Al-Jawzi"];

const popularCollections = [
  "Quranic Sciences",
  "Hadith Sciences",
  "Fiqh",
  "Islamic Theology",
];

export default function SearchBarEmptyState({
  setValue,
}: {
  setValue: (value: string) => void;
}) {
  const recentSearches = useSearchHistoryStore((s) => s.recentSearches);
  const clearRecentSearches = useSearchHistoryStore(
    (s) => s.clearRecentSearches,
  );

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <DottedList
          items={[
            <h2 className="font-semibold">Recent Searches</h2>,
            recentSearches.length > 0 && (
              <button
                className="text-primary underline"
                onClick={clearRecentSearches}
              >
                Clear
              </button>
            ),
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-3">
          {recentSearches.length > 0 ? (
            recentSearches.map((search, idx) => (
              <SearchPill key={idx} onClick={() => setValue(search)}>
                {search}
              </SearchPill>
            ))
          ) : (
            <p className="text-sm text-foreground/50">
              Your recent searches will show up here
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-semibold">Popular Searches</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {popularSearches.map((search, idx) => (
            <SearchPill key={idx} showIcon onClick={() => setValue(search)}>
              {search}
            </SearchPill>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold">Popular Collections</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {popularCollections.map((collection, idx) => (
            <SearchPill key={idx} showIcon onClick={() => setValue(collection)}>
              {collection}
            </SearchPill>
          ))}
        </div>
      </div>
    </div>
  );
}
