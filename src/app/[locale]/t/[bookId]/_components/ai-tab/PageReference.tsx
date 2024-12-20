import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import SourceModal from "@/components/ui/source-modal";

interface PageReferenceProps {
  "data-number": string;
  sourceNodes: SemanticSearchBookNode[];
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
}

function PageReference({
  sourceNodes,
  getVirtuosoScrollProps,
  ...props
}: PageReferenceProps) {
  const number = props["data-number"];

  const idx = Number(number) - 1;
  const sourceNode = sourceNodes[idx]!;

  return (
    <SourceModal
      source={sourceNode}
      getVirtuosoScrollProps={getVirtuosoScrollProps}
    />
  );
}

export default PageReference;
