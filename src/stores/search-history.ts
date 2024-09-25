import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryStore {
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
}

const MAX_RECENT_SEARCHES = 12;

export const useSearchHistoryStore = create(
  persist<SearchHistoryStore>(
    (set) => ({
      recentSearches: [],
      clearRecentSearches: () => set({ recentSearches: [] }),
      addRecentSearch: (search: string) =>
        set((state) => {
          const oldSearches = [...state.recentSearches];
          const searchIndex = oldSearches.indexOf(search);
          if (searchIndex !== -1) {
            oldSearches.splice(searchIndex, 1);
          }

          oldSearches.unshift(search);

          return { recentSearches: oldSearches.slice(0, MAX_RECENT_SEARCHES) };
        }),
    }),
    { name: "search-history" },
  ),
);
