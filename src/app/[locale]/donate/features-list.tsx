import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const FeaturesList = ({
  className,
  features,
  style = "check",
}: {
  features: React.ReactNode[];
  style?: "list" | "check";
  className?: string;
}) => (
  <ul
    className={cn(
      "flex flex-col gap-4",
      style === "list" && "list-inside list-disc",
      className,
    )}
  >
    {features.map((feature, idx) => (
      <li
        className={cn("text-lg", style === "check" && "flex items-start gap-4")}
        key={idx}
      >
        {style === "check" ? (
          <>
            <CheckCircleIcon className="mt-1 size-6 shrink-0 text-teal-700" />
            <p>{feature}</p>
          </>
        ) : (
          feature
        )}
      </li>
    ))}
  </ul>
);

export default FeaturesList;
