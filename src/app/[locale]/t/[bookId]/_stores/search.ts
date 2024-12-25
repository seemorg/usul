import { create } from "zustand";

interface SearchStore {
  value: string;
  page: number;
  type: "semantic" | "keyword";

  setValue: (value: string, page: number) => void;
  setType: (type: "semantic" | "keyword", page: number) => void;
  setPage: (page: number) => void;

  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  value: "",
  page: 1,
  type: "keyword",
  setValue: (value: string, page: number) => set({ value, page }),
  setType: (type: "semantic" | "keyword", page: number) => set({ type, page }),
  setPage: (page: number) => set({ page }),
  reset: () => set({ value: "", page: 1, type: "keyword" }),
}));
