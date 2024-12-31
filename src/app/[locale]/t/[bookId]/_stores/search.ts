import { create } from "zustand";

type SearchType = "simple" | "advanced" | "semantic";

interface SearchStore {
  value: string;
  advancedQuery: any;
  page: number;
  type: SearchType;

  setValue: (value: string, page: number) => void;
  setType: (type: SearchType, page: number) => void;
  setPage: (page: number) => void;
  setAdvancedQuery: (advancedQuery: any) => void;
  reset: () => void;
}

const defaultAdvancedQuery = {
  type: "group",
  conditions: [
    {
      operator: "like",
      value: "",
      not: false,
    },
  ],
  combineWith: "AND",
};

export const useSearchStore = create<SearchStore>((set) => ({
  value: "",
  advancedQuery: defaultAdvancedQuery,
  page: 1,
  type: "simple",
  setValue: (value: string, page: number) => set({ value, page }),
  setAdvancedQuery: (advancedQuery: any) => set({ advancedQuery }),
  setType: (type: SearchType, page: number) => set({ type, page }),
  setPage: (page: number) => set({ page }),
  reset: () =>
    set({
      value: "",
      page: 1,
      type: "simple",
      advancedQuery: defaultAdvancedQuery,
    }),
}));
