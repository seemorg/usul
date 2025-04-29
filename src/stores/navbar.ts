import { create } from "zustand";

interface NavbarStore {
  showNavbar: boolean;
  setShowNavbar: (show: boolean) => void;

  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

export const useNavbarStore = create<NavbarStore>((set) => ({
  showNavbar: true,
  setShowNavbar: (show: boolean) => set({ showNavbar: show }),

  showSearch: false,
  setShowSearch: (show: boolean) => set({ showSearch: show }),
}));
