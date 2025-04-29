import type { tabs } from "@/app/[locale]/t/[bookId]/_components/sidebar/tabs";
import { create } from "zustand";

type TabId = (typeof tabs)[number]["id"];

interface MobileReaderStore {
  activeTabId: TabId | null;
  setActiveTabId: (activeTabId: TabId | null) => void;
  closeMobileSidebar: () => void;
}

export const useMobileReaderStore = create<MobileReaderStore>((set) => ({
  activeTabId: null,
  setActiveTabId: (activeTabId: TabId | null) => set({ activeTabId }),
  closeMobileSidebar: () => set({ activeTabId: null }),
}));
