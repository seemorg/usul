import { create } from "zustand";

interface DemoStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useDemo = create<DemoStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
