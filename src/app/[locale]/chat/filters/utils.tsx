import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

export const FilterButton = ({
  icon: Icon,
  label,
  ...props
}: {
  icon: React.ElementType;
  label: string;
} & ButtonProps) => {
  return (
    <Button
      variant="outline"
      className="text-muted-foreground items-center gap-2 rounded-full border text-sm shadow-none"
      {...props}
    >
      <Icon className="size-4" />
      {label}
      <ChevronDownIcon className="size-4" />
    </Button>
  );
};
