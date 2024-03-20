import { cn } from "@/lib/utils";

interface DottedListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
}

export default function DottedList({
  items,
  className,
  ...props
}: DottedListProps) {
  const filteredItems = items.filter((item) => item); // remove null or undefined items

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-3 gap-y-1",
        className,
      )}
      {...props}
    >
      {filteredItems.map((item, idx) => (
        <div className="flex items-center" key={idx}>
          {item}

          {filteredItems.length !== idx + 1 && (
            <span className="text-muted-foreground ltr:ml-3 rtl:mr-3">•</span>
          )}
        </div>
      ))}
    </div>
  );
}
