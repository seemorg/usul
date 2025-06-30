import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import SourceModal from "@/components/ui/source-modal";

interface PageReferenceProps {
  "data-number": string;
  sourceNodes: SemanticSearchBookNode[];
}

function PageReference({ sourceNodes, ...props }: PageReferenceProps) {
  const number = props["data-number"];

  const idx = Number(number) - 1;
  const sourceNode = sourceNodes[idx]!;

  return <SourceModal source={sourceNode} />;
}

export default PageReference;
