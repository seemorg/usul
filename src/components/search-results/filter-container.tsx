import { type LinkProps } from "next/link";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");

  return (
    <div className="relative rounded-md p-4 dark:bg-accent sm:border sm:border-input sm:bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          <span className="flex items-center gap-2">
            {title}
            {isLoading && <Spinner className="h-4 w-4" />}
          </span>
        </h3>

        {clearFilterHref ? (
          <Button
            variant="link"
            className="flex h-auto gap-2 px-0 py-0"
            asChild
          >
            <Link href={clearFilterHref} scroll={false}>
              {t("clear-all")} <XMarkIcon className="h-4 w-4" />
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
