import { type LinkProps } from "next/link";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "@/navigation";

interface FilterContainerProps {
  title: string;
  isLoading?: boolean;
  titleChildren?: React.ReactNode;
  clearFilterHref?: LinkProps["href"];
  children: React.ReactNode;
}

export default function FilterContainer({
  title,
  isLoading,
  titleChildren,
  clearFilterHref,
  children,
}: FilterContainerProps) {
  return (
    <div className="relative rounded-md p-4 dark:bg-accent sm:border sm:border-input sm:bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          <span className="flex items-center">
            {title}
            {isLoading && <Spinner className="ml-2 h-4 w-4" />}
          </span>
        </h3>

        {clearFilterHref ? (
          <Button variant="link" className="h-auto px-0 py-0" asChild>
            <Link href={clearFilterHref} scroll={false}>
              Clear all <XMarkIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          titleChildren
        )}
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}
