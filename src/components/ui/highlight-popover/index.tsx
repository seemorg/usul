import React, {
  memo,
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

const SIDE_PADDING = 30; // Adjust this value as needed
const POPOVER_DELAY = 150; // Delay in ms before showing popover

/**
 * Represents the position of the popover.
 */
interface Position {
  /** The top position of the popover in pixels. */
  top: number;
  /** The left position of the popover in pixels. */
  left: number;
}

/**
 * Defines the possible alignment options for the popover.
 */
type PopoverAlignment = "left" | "center" | "right";

/**
 * Props for the HighlightPopover component.
 */
interface HighlightPopoverProps {
  /** The content where text selection will trigger the popover. */
  children: React.ReactNode;
  /** Function to render the popover component. */
  renderPopover: (props: {
    position: Position;
    selection: string;
  }) => React.ReactNode;
  /** Additional CSS class for the wrapper element. */
  className?: string;
  /** Offset for adjusting popover position. */
  offset?: { x?: number; y?: number };
  /** The z-index of the popover. */
  zIndex?: number;
  /** Alignment of the popover relative to the selected text. */
  alignment?: PopoverAlignment;
  /** Minimum length of text selection to trigger the popover. */
  minSelectionLength?: number;
  /** Callback fired when text selection starts. */
  onSelectionStart?: () => void;
  /** Callback fired when text selection ends. */
  onSelectionEnd?: (selection: string) => void;
  /** Callback fired when the popover is shown. */
  onPopoverShow?: () => void;
  /** Callback fired when the popover is hidden. */
  onPopoverHide?: () => void;
}

/**
 * Context type for the HighlightPopover.
 */
interface HighlightPopoverContextType {
  /** Indicates whether the popover is currently visible. */
  showPopover: boolean;
  /** Function to manually control popover visibility. */
  setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  /** Current position of the popover. */
  popoverPosition: Position;
  /** Currently selected text. */
  currentSelection: string;
  /** Function to manually set the current selection. */
  setCurrentSelection: React.Dispatch<React.SetStateAction<string>>;
}

const HighlightPopoverContext =
  createContext<HighlightPopoverContextType | null>(null);

/**
 * Hook to access the HighlightPopover context.
 * @returns The HighlightPopover context value.
 * @throws Error if used outside of a HighlightPopover component.
 */
export function useHighlightPopover() {
  const context = useContext(HighlightPopoverContext);
  if (!context) {
    throw new Error(
      "useHighlightPopover must be used within a HighlightPopover",
    );
  }
  return context;
}

/**
 * Memoized component for rendering the popover content.
 */
const PopoverContent = memo(
  forwardRef<
    HTMLDivElement,
    {
      renderPopover: HighlightPopoverProps["renderPopover"];
      position: Position;
      selection: string;
      style: React.CSSProperties;
    }
  >(({ renderPopover, position, selection, style }, ref) => (
    <div
      ref={ref}
      style={style}
      role="tooltip"
      aria-live="polite"
      className="relative select-none after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-full after:rotate-180 after:border-8 after:border-transparent after:border-b-[#232324]"
    >
      {renderPopover({ position, selection })}
    </div>
  )),
);

PopoverContent.displayName = "PopoverContent";

/**
 * HighlightPopover component for creating popovers on text selection within a container.
 */
export const HighlightPopover = memo(function HighlightPopover({
  children,
  renderPopover,
  className = "",
  offset = { x: 0, y: 0 },
  zIndex = 99999,
  alignment = "center",
  minSelectionLength = 1,
  onSelectionStart,
  onSelectionEnd,
  onPopoverShow,
  onPopoverHide,
}: HighlightPopoverProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<Position>({
    top: 0,
    left: 0,
  });
  const [currentSelection, setCurrentSelection] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionRangeRef = useRef<Range | null>(null);
  const showPopoverTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const popoverRef = useRef<HTMLDivElement>(null);

  /**
   * Checks if the current selection is within the HighlightPopover container.
   * @param selection - The current selection object.
   * @returns True if the selection is within the container, false otherwise.
   */
  const isSelectionWithinContainer = useCallback((selection: Selection) => {
    if (!containerRef.current) return false;
    const container = containerRef.current;
    return Array.from({ length: selection.rangeCount }).every((_, i) => {
      const range = selection.getRangeAt(i);
      return (
        container.contains(range.commonAncestorContainer) &&
        container.contains(range.startContainer) &&
        container.contains(range.endContainer)
      );
    });
  }, []);

  /**
   * Updates the popover position based on the current selection and alignment.
   */
  const updatePopoverPosition = useCallback(() => {
    if (!containerRef.current || !selectionRangeRef.current) return;

    const range = selectionRangeRef.current;
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const top = rect.bottom - containerRect.top - (offset.y ?? 0);
    let left: number;

    switch (alignment) {
      case "left":
        left = rect.left - containerRect.left + (offset.x ?? 0);
        break;
      case "right":
        left = rect.right - containerRect.left - (offset.x ?? 0);
        break;
      case "center":
      default:
        left =
          rect.left - containerRect.left + rect.width / 2 + (offset.x ?? 0);
        break;
    }

    setPopoverPosition({ top, left });
  }, [offset, alignment]);

  /**
   * Handles the text selection and popover positioning.
   */
  const handleSelection = useCallback(() => {
    // Clear any existing timeout
    if (showPopoverTimeoutRef.current) {
      clearTimeout(showPopoverTimeoutRef.current);
    }

    const selection = window.getSelection();
    if (
      selection &&
      selection.toString().trim().length >= minSelectionLength &&
      isSelectionWithinContainer(selection)
    ) {
      onSelectionStart?.();
      const range = selection.getRangeAt(0);
      selectionRangeRef.current = range;

      updatePopoverPosition();
      setCurrentSelection(selection.toString());

      // Set timeout to show popover after delay
      showPopoverTimeoutRef.current = setTimeout(() => {
        setShowPopover(true);
        onPopoverShow?.();
        onSelectionEnd?.(selection.toString());
      }, POPOVER_DELAY);
    } else {
      setShowPopover(false);
      onPopoverHide?.();
    }
  }, [
    isSelectionWithinContainer,
    minSelectionLength,
    onSelectionStart,
    onSelectionEnd,
    onPopoverShow,
    onPopoverHide,
    updatePopoverPosition,
  ]);

  // Add event listener for selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      requestAnimationFrame(handleSelection);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (showPopoverTimeoutRef.current) {
        clearTimeout(showPopoverTimeoutRef.current);
      }
    };
  }, [handleSelection]);

  const contextValue = useMemo<HighlightPopoverContextType>(
    () => ({
      showPopover,
      setShowPopover,
      popoverPosition,
      currentSelection,
      setCurrentSelection,
    }),
    [showPopover, popoverPosition, currentSelection],
  );

  const popoverStyle = useMemo(() => {
    const isClient = typeof window !== "undefined";
    const windowWidth = isClient ? window.innerWidth : 0;

    const popoverWidth = popoverRef.current?.clientWidth;
    const styles: React.CSSProperties = {
      zIndex,
      width: "max-content",
      position: "absolute",
      top: `${popoverPosition.top}px`,
      opacity: showPopover ? 1 : 0,
      pointerEvents: showPopover ? "auto" : "none",
    };

    if (!popoverWidth) return styles;

    const halfWidth = popoverWidth / 2;
    let left = popoverPosition.left;

    if (alignment === "left") {
      // Adjust 'left' to prevent overflow with side padding
      left = Math.min(
        Math.max(SIDE_PADDING, left),
        windowWidth - popoverWidth - SIDE_PADDING,
      );
      styles.left = `${left}px`;
    } else if (alignment === "center") {
      // Center the popover and prevent overflow on both sides with padding
      left = Math.min(
        Math.max(halfWidth + SIDE_PADDING, left),
        windowWidth - halfWidth - SIDE_PADDING,
      );
      styles.left = `${left}px`;
      styles.transform = "translateX(-50%)";
    } else if (alignment === "right") {
      // Adjust 'left' for right alignment with side padding
      left = Math.min(
        Math.max(popoverWidth + SIDE_PADDING, left),
        windowWidth - SIDE_PADDING,
      );
      styles.left = `${left}px`;
      styles.transform = "translateX(-100%)";
    }

    return styles;
  }, [
    zIndex,
    popoverPosition.top,
    popoverPosition.left,
    alignment,
    showPopover,
  ]);

  return (
    <HighlightPopoverContext.Provider value={contextValue}>
      <div className={cn("relative", className)} ref={containerRef}>
        {children}

        <PopoverContent
          ref={popoverRef}
          renderPopover={renderPopover}
          position={popoverPosition}
          selection={currentSelection}
          style={popoverStyle}
        />
      </div>
    </HighlightPopoverContext.Provider>
  );
});
