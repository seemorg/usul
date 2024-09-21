import { CommandItem } from "@/components/ui/command";
import { Link } from "@/navigation";

function SearchBarItem({
  value,
  onSelect,
  href,
  children,
}: {
  value: string;
  href?: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  const Comp = (href ? Link : "button") as any;

  return (
    <CommandItem value={value} onSelect={onSelect} className="px-0 py-0">
      <Comp
        {...(href ? { href } : {})}
        className="flex h-full w-full items-start justify-between px-4 py-3 hover:bg-accent"
      >
        {children}
      </Comp>
    </CommandItem>
  );
}

export default SearchBarItem;
