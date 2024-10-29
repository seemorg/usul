import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useCallback } from "react";
import { useReaderVirtuoso } from "../context";
import { UsePageNavigationReturnType } from "../usePageNavigation";
import { useTranslations } from "next-intl";

interface PageReferenceProps {
  "data-number": string;
  sourceNodes: SemanticSearchBookNode[];
  getVirtuosoIndex: UsePageNavigationReturnType["getVirtuosoIndex"];
}

function PageReference({
  sourceNodes,
  getVirtuosoIndex,
  ...props
}: PageReferenceProps) {
  const virtuosoRef = useReaderVirtuoso();
  const t = useTranslations("reader");
  const handleNavigateToPage = useCallback(
    (page?: { vol: string; page: number }) => {
      if (!page) return;

      const props = getVirtuosoIndex(page);
      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    },
    [getVirtuosoIndex],
  );

  const number = props["data-number"];
  const idx = Number(number) - 1;

  const sourceNode = sourceNodes[idx]!;
  const pg = sourceNode.metadata.pages[0]!;

  return (
    <button
      className="inline cursor-pointer text-primary underline-offset-4 hover:underline"
      onClick={() => handleNavigateToPage(pg)}
    >
      [
      {t("chat.pg-x-vol", {
        page: pg.page,
        vol: pg.vol,
      })}
      ]
    </button>
  );
}

export default PageReference;
