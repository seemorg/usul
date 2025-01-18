import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const FeaturesList = ({
  className,
  features,
}: {
  features: React.ReactNode[];
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    {features.map((feature, idx) => (
      <div className="flex items-start gap-4" key={idx}>
        <CheckCircleIcon className="mt-1 size-6 flex-shrink-0 text-teal-700" />
        <p className="text-lg">{feature}</p>
      </div>
    ))}
  </div>
);

export default FeaturesList;
