"use client";

import { createContext, useContext, useRef } from "react";
import type { WindowVirtualizerHandle } from "virtua";

type VirtuosoContextType = React.RefObject<WindowVirtualizerHandle>;

const VirtuosoContext = createContext<VirtuosoContextType>(
  {} as VirtuosoContextType,
);

export function useReaderVirtuoso() {
  return useContext(VirtuosoContext);
}

export default function ReaderContextProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const virtuosoRef = useRef<WindowVirtualizerHandle>(null);

  return (
    <VirtuosoContext.Provider value={virtuosoRef}>
      {children}
    </VirtuosoContext.Provider>
  );
}
