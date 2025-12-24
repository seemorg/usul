import type { MessageAnnotation } from "@/types/chat";
import { useState } from "react";
import { ShinyText } from "@/components/shiny-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";

function findLast<T>(
  array: T[],
  predicate: (value: T) => boolean,
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!)) {
      return array[i];
    }
  }
}

const formatQueries = (queries: string[]) => {
  return queries.map((q) => `<i>${q}</i>`).join(", ");
};

const StatusLabel = ({
  isLoading,
  annotations,
}: {
  isLoading: boolean;
  annotations: MessageAnnotation[];
}) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);

  let text = t("chat.status.thinking");
  if (!isLoading) {
    const queriesStatus = findLast(
      annotations,
      (annotation) =>
        annotation.type === "STATUS" && annotation.value === "searching",
    ) as Extract<MessageAnnotation, { value: "searching" }> | undefined;

    if (queriesStatus) {
      text = `${t("chat.status.done_searched")} ${formatQueries(queriesStatus.queries)}`;
    } else {
      text = t("chat.status.done");
    }
  } else {
    const status = findLast(
      annotations,
      (annotation) => annotation.type === "STATUS",
    ) as Extract<MessageAnnotation, { type: "STATUS" }> | undefined;
    const queriesStatus = findLast(
      annotations,
      (annotation) =>
        annotation.type === "STATUS" && annotation.value === "searching",
    ) as Extract<MessageAnnotation, { value: "searching" }> | undefined;

    if (status?.value === "generating-queries") {
      text = t("chat.status.generating_queries");
    } else if (status?.value === "generating-response") {
      text = `${t("chat.status.generating_response")} ${formatQueries(queriesStatus?.queries ?? [])}`;
    } else if (status?.value === "searching") {
      text = `${t("chat.status.searching")} ${formatQueries(status.queries)}`;
    }
  }

  return (
    <div className="flex items-start gap-2">
      <ShinyText
        className={cn(
          "-mb-2 w-fit flex-1 font-medium",
          "sm:block",
          !isExpanded && "line-clamp-1 sm:line-clamp-none",
        )}
        shimmerWidth={40}
        disabled={!isLoading}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground h-auto p-1 sm:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
};

export default StatusLabel;
