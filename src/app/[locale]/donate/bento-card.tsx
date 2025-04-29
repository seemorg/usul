import { cn } from "@/lib/utils";

const BentoCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-card rounded-3xl p-12", className)} {...props} />
);

export default BentoCard;
