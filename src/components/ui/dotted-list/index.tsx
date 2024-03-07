import { cn } from "@/lib/utils";

interface DottedListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
}

export default function DottedList({
  items,
  className,
  ...props
}: DottedListProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-3 gap-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item, idx) => (
        <div className="flex items-center" key={idx}>
          {item}

          {items.length !== idx + 1 && (
            <span className="ml-3 text-muted-foreground">•</span>
          )}
        </div>
      ))}
    </div>
  );
}
