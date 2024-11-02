import React, {
  memo,
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import { cn } from "@/lib/utils";

const POPOVER_WIDTH = 285;

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
  ({
    renderPopover,
    position,
    selection,
    style,
  }: {
    renderPopover: HighlightPopoverProps["renderPopover"];
    position: Position;
    selection: string;
    style: React.CSSProperties;
  }) => (
    <div
      style={style}
      role="tooltip"
      aria-live="polite"
      className="select-none"
    >
      {renderPopover({ position, selection })}
    </div>
  ),
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
  zIndex = 40,
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
      setShowPopover(true);
      onPopoverShow?.();
      onSelectionEnd?.(selection.toString());
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
    // Ensure popover stays within viewport bounds
    const left = Math.min(
      Math.max(POPOVER_WIDTH / 2, popoverPosition.left),
      (window?.innerWidth ?? 0) - POPOVER_WIDTH / 2,
    );

    return {
      zIndex,
      width: "max-content",
      position: "absolute" as const,
      top: `${popoverPosition.top}px`,
      ...(alignment === "left" && { left: `${left}px` }),
      ...(alignment === "center" && {
        left: `${left}px`,
        transform: "translateX(-50%)",
      }),
      ...(alignment === "right" && {
        right: `calc(100% - ${left}px)`,
      }),
    };
  }, [zIndex, popoverPosition.top, popoverPosition.left, alignment]);

  return (
    <HighlightPopoverContext.Provider value={contextValue}>
      <div className={cn("relative", className)} ref={containerRef}>
        {children}

        {showPopover && (
          <PopoverContent
            renderPopover={renderPopover}
            position={popoverPosition}
            selection={currentSelection}
            style={popoverStyle}
          />
        )}
      </div>
    </HighlightPopoverContext.Provider>
  );
});
