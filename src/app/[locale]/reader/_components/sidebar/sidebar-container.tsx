import { cn } from "@/lib/utils";

export default function SidebarContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-8", className)} {...props} />;
}
