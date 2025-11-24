"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SelectableListItem {
  id: string;
  content: React.ReactNode;
}

interface SelectableListProps {
  items: SelectableListItem[];
  className?: string;
}

export function SelectableList({ items, className }: SelectableListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    items[0]?.id ?? null,
  );

  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <li
            key={item.id}
            onClick={() => setSelectedId(isSelected ? null : item.id)}
            className="flex cursor-pointer items-start gap-4 transition-colors"
          >
            <div
              className={cn(
                "w-1 shrink-0 self-stretch transition-colors",
                isSelected ? "bg-collection-green" : "bg-muted",
              )}
            />
            <p
              className={cn(
                "transition-colors",
                isSelected ? "text-collection-green font-bold" : "",
              )}
            >
              {item.content}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
