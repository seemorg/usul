"use client";

import type { VListHandle } from "virtua";
import { createContext, use, useRef, useState } from "react";

type VirtuosoContextType = React.RefObject<VListHandle | null>;

const VirtuosoContext = createContext<VirtuosoContextType>(
  {} as VirtuosoContextType,
);

type ReaderScrollerContextType = { element: HTMLDivElement } | null;

const ReaderScrollerContext = createContext<ReaderScrollerContextType>(
  {} as ReaderScrollerContextType,
);

type SetReaderScrollerContextType = React.Dispatch<
  React.SetStateAction<ReaderScrollerContextType>
>;

const SetReaderScrollerContext = createContext<SetReaderScrollerContextType>(
  {} as SetReaderScrollerContextType,
);

export function useReaderVirtuoso() {
  return use(VirtuosoContext);
}

export function useReaderScroller() {
  return use(ReaderScrollerContext);
}

export function useSetReaderScroller() {
  return use(SetReaderScrollerContext);
}

export default function ReaderContextProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [containerEl, setContainerEl] = useState<{
    element: HTMLDivElement;
  } | null>(null);
  const virtuosoRef = useRef<VListHandle>(null);

  return (
    <VirtuosoContext.Provider value={virtuosoRef}>
      <ReaderScrollerContext.Provider value={containerEl}>
        <SetReaderScrollerContext.Provider value={setContainerEl}>
          {children}
        </SetReaderScrollerContext.Provider>
      </ReaderScrollerContext.Provider>
    </VirtuosoContext.Provider>
  );
}
