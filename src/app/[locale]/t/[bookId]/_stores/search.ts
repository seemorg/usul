import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { create } from "zustand";

interface SearchStore {
  value: string;
  setValue: (value: string) => void;
  results: SemanticSearchBookNode[] | null;
  setResults: (results: SemanticSearchBookNode[] | null) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  value: "",
  setValue: (value: string) => set({ value }),
  results: null,
  setResults: (results: SemanticSearchBookNode[] | null) => set({ results }),
  reset: () => set({ value: "", results: null }),
}));
