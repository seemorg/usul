import React from "react";
import { cn } from "@/lib/utils";

interface DottedListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: (
    | React.ReactNode
    | {
        text: string;
        className?: string;
      }
  )[];
  dotClassName?: string;
  itemClassName?: string;
}

export default function DottedList({
  items,
  className,
  dotClassName,
  itemClassName,
  ...props
}: DottedListProps) {
  // remove null or undefined items
  const filteredItems = items.filter((item) => !!item);

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-3 gap-y-1",
        className,
      )}
      {...props}
    >
      {filteredItems.map((item, idx) => {
        const hasText = typeof item === "object" && "text" in item!;

        return (
          <div
            className={cn(
              "flex items-center",
              hasText && item.className,
              itemClassName,
            )}
            key={idx}
          >
            {hasText ? item.text : item}

            {filteredItems.length !== idx + 1 && (
              <span
                className={cn(
                  "text-muted-foreground ltr:ml-3 rtl:mr-3",
                  dotClassName,
                )}
              >
                •
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
