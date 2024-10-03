"use client";

import React, { useRef, useState } from "react";
import type { VListHandle } from "virtua";
// import type { VirtuosoHandle } from "react-virtuoso";

type VirtuosoContextType = React.RefObject<VListHandle>;

const VirtuosoContext = React.createContext<VirtuosoContextType>(
  {} as VirtuosoContextType,
);

type ReaderScrollerContextType = { element: HTMLDivElement } | null;

const ReaderScrollerContext = React.createContext<ReaderScrollerContextType>(
  {} as ReaderScrollerContextType,
);

type SetReaderScrollerContextType = React.Dispatch<
  React.SetStateAction<ReaderScrollerContextType>
>;

const SetReaderScrollerContext =
  React.createContext<SetReaderScrollerContextType>(
    {} as SetReaderScrollerContextType,
  );

export function useReaderVirtuoso() {
  return React.useContext(VirtuosoContext);
}

export function useReaderScroller() {
  return React.useContext(ReaderScrollerContext);
}

export function useSetReaderScroller() {
  return React.useContext(SetReaderScrollerContext);
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
