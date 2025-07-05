import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  FoldersIcon,
  LibraryBigIcon,
  MapPinIcon,
  UserPenIcon,
} from "lucide-react";

import { useChatFilters } from "./chat-filters";

const FilterButton = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => {
  return (
    <Button
      variant="outline"
      className="text-muted-foreground items-center gap-2 rounded-full border text-sm shadow-none"
    >
      <Icon className="size-4" />
      {label}
      <ChevronDownIcon className="size-4" />
    </Button>
  );
};

export default function ChatFilters() {
  const open = useChatFilters((s) => s.open);

  return (
    <div
      className={cn(
        "transition-[height,opacity] will-change-[transform,opacity,height]",
        open ? "h-auto" : "pointer-events-none h-0 opacity-0",
      )}
    >
      <div
        className={cn(
          "border-border mx-auto flex w-full items-center justify-between gap-4 border-b px-4 py-4 md:max-w-3xl",
        )}
      >
        <div className="flex gap-4">
          <FilterButton icon={LibraryBigIcon} label="Text" />
          <FilterButton icon={UserPenIcon} label="Author" />
          <FilterButton icon={FoldersIcon} label="Collection" />
          <FilterButton icon={MapPinIcon} label="Location" />
        </div>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-accent text-sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
