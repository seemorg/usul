import type { MessageAnnotation } from "@/types/chat";
import { ShinyText } from "@/components/shiny-text";

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
  console.log(annotations);

  let text = "Thinking...";
  if (!isLoading) {
    const status = findLast(
      annotations,
      (annotation) =>
        annotation.type === "STATUS" && annotation.value === "searching",
    ) as Extract<MessageAnnotation, { value: "searching" }> | undefined;

    if (status) {
      text = `Done. Searched for ${formatQueries(status.queries)}`;
    } else {
      text = "Done";
    }
  } else {
    const status = findLast(
      annotations,
      (annotation) => annotation.type === "STATUS",
    ) as Extract<MessageAnnotation, { type: "STATUS" }> | undefined;

    if (status?.value === "generating-queries") {
      text = "Generating queries...";
    } else if (status?.value === "generating-response") {
      text = "Generating response...";
    } else if (status?.value === "searching") {
      text = `Searching for ${formatQueries(status.queries)}`;
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
