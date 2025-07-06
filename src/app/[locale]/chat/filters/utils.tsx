import type { ButtonProps } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

export const FilterButton = ({
  icon: Icon,
  label,
  count,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  count?: number;
} & ButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "text-muted-foreground items-center gap-2 rounded-full border px-3 text-sm shadow-none",
        count &&
          count > 0 &&
          "bg-primary-foreground dark:bg-primary/20 dark:text-primary-foreground hover:bg-primary/30 dark:hover:bg-primary/40 border-primary-foreground! dark:border-primary/20! text-primary hover:text-primary shadow-none",
      )}
      {...props}
    >
      <Icon className="size-4" />
      {label}

      {count && count > 0 ? (
        <Badge className="size-4 items-center justify-center rounded-full p-0 text-xs">
          {count > 9 ? "9+" : count}
        </Badge>
      ) : (
        <ChevronDownIcon className="size-4" />
      )}
    </Button>
  );
};
