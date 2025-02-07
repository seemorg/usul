import { cn } from "@/lib/utils";

const BentoCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-3xl bg-card p-12", className)} {...props} />
);

export default BentoCard;
