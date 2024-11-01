import { create } from "zustand";

interface BookDetailsStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useBookDetailsStore = create<BookDetailsStore>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
