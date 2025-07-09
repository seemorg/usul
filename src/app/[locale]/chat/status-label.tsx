import type { MessageAnnotation } from "@/types/chat";
import { ShinyText } from "@/components/shiny-text";
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
    <ShinyText
      className="-mb-2 w-fit font-medium"
      shimmerWidth={40}
      disabled={!isLoading}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default StatusLabel;
