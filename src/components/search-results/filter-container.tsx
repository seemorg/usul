import { type LinkProps } from "next/link";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Input, type InputProps } from "../ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InfoIcon } from "lucide-react";

interface FilterContainerProps {
  title: string;
  titleInfo?: string;
  isLoading?: boolean;
  titleChildren?: React.ReactNode;
  clearFilterHref?: LinkProps["href"];
  children: React.ReactNode;
}

function FilterContainer({
  title,
  titleInfo,
  isLoading,
  titleChildren,
  clearFilterHref,
  children,
}: FilterContainerProps) {
  const t = useTranslations("common");

  return (
    <div className="relative rounded-md p-4 sm:border sm:border-input sm:bg-gray-50 dark:sm:bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          <span className="flex items-center gap-2">
            {title}
            {titleInfo && (
              <Tooltip>
                <TooltipTrigger className="text-muted-foreground">
                  <InfoIcon className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>{titleInfo}</TooltipContent>
              </Tooltip>
            )}
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

FilterContainer.Input = function FilterContainerInput(props: InputProps) {
  return (
    <Input
      className="border border-gray-300 bg-background shadow-none dark:border-border"
      {...props}
    />
  );
};

FilterContainer.List = function FilterContainerList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-h-[300px] w-full space-y-3 overflow-y-scroll text-sm sm:max-h-none sm:overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
};

FilterContainer.Checkbox = function FilterContainerCheckbox({
  title,
  children,
  id,
  count,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
  count?: number | string;
}) {
  return (
    <div className="flex cursor-pointer items-center gap-2">
      <Checkbox id={id} className="h-4 w-4" {...props} />

      <label
        htmlFor={id}
        className="flex w-full items-center justify-between text-sm"
        title={title}
      >
        <span className="line-clamp-1 min-w-0 max-w-[70%] break-words">
          {children}
        </span>

        {typeof count === "number" ? (
          <span className="rounded-md px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
            {count}
          </span>
        ) : null}
      </label>
    </div>
  );
};

export default FilterContainer;
