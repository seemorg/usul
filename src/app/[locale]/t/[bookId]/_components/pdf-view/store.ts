import { create } from "zustand";

export type PdfChapter = {
  id: number;
  title: string;
  page: number;
  children: PdfChapter[];
};

interface PdfChapterStore {
  chapters: PdfChapter[];
  setChapters: (chapters: PdfChapter[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  navigateToPage: (page: number) => void;
  setNavigateToPage: (navigateToPage: (page: number) => void) => void;
}

export const usePdfChapterStore = create<PdfChapterStore>((set) => ({
  chapters: [],
  setChapters: (chapters: PdfChapter[]) => set({ chapters }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  navigateToPage: (page: number) => {},
  setNavigateToPage: (navigateToPage: (page: number) => void) =>
    set({ navigateToPage }),
}));
