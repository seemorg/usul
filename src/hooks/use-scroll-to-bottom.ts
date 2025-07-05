import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";

type ScrollFlag = ScrollBehavior | false;

const useScrollStore = create<{
  isAtBottom: boolean;
  scrollBehavior: ScrollFlag;
  setIsAtBottom: (isAtBottom: boolean) => void;
  setScrollBehavior: (scrollBehavior: ScrollFlag) => void;
}>((set) => ({
  isAtBottom: false,
  setIsAtBottom: (isAtBottom: boolean) => set({ isAtBottom }),
  scrollBehavior: false,
  setScrollBehavior: (scrollBehavior: ScrollFlag) => set({ scrollBehavior }),
}));

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { isAtBottom, scrollBehavior, setIsAtBottom, setScrollBehavior } =
    useScrollStore();

  useEffect(() => {
    if (scrollBehavior) {
      endRef.current?.scrollIntoView({ behavior: scrollBehavior });
      setScrollBehavior(false);
    }
  }, [setScrollBehavior, scrollBehavior]);

  const scrollToBottom = useCallback(
    (scrollBehavior: ScrollBehavior = "smooth") => {
      setScrollBehavior(scrollBehavior);
    },
    [setScrollBehavior],
  );

  function onViewportEnter() {
    setIsAtBottom(true);
  }

  function onViewportLeave() {
    setIsAtBottom(false);
  }

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  };
}
