import { cn } from "@/lib/utils";

const BentoCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-2xl bg-card p-12 shadow-md", className)}
    {...props}
  />
);

export default BentoCard;
