/* eslint-disable react/jsx-key */
import DottedList from "@/components/ui/dotted-list";
import { TrendingUpIcon } from "lucide-react";

const SearchPill = ({
  children,
  showIcon = false,
}: {
  children: React.ReactNode;
  showIcon?: boolean;
}) => {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent">
      {showIcon && <TrendingUpIcon className="size-4" />}
      {children}
    </button>
  );
};

const recentSearches: string[] = [
  "Fiqh",
  "مواقيت الصلاة",
  "Al-Rissala",
  "Ibn Al-Jawzi",
  "Fiqh",
  "مواقيت الصلاة",
  "Al-Rissala",
  "Ibn Al-Jawzi",
  "مواقيت الصلاة",
  "Al-Rissala",
  "Ibn Al-Jawzi",
];

const popularSearches = ["Fiqh", "مواقيت الصلاة", "Al-Rissala", "Ibn Al-Jawzi"];

const popularCollections = [
  "Quranic Sciences",
  "Hadith Sciences",
  "Fiqh",
  "Islamic Theology",
];

export default function SearchBarEmptyState() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <DottedList
          items={[
            <h2 className="font-semibold">Recent Searches</h2>,
            recentSearches.length > 0 && (
              <button className="text-primary underline">Clear</button>
            ),
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-3">
          {recentSearches.length > 0 ? (
            recentSearches.map((search, idx) => (
              <SearchPill key={idx}>{search}</SearchPill>
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
            <SearchPill key={idx} showIcon>
              {search}
            </SearchPill>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold">Popular Collections</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {popularCollections.map((collection, idx) => (
            <SearchPill key={idx} showIcon>
              {collection}
            </SearchPill>
          ))}
        </div>
      </div>
    </div>
  );
}
