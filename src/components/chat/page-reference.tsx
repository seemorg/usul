import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import SourceModal from "@/components/ui/source-modal";

type Source = SemanticSearchBookNode & {
  book?: { slug: string; primaryName: string };
};

interface PageReferenceProps {
  "data-number"?: string;
  "data-numbers"?: string;
  sourceNodes: Source[];
}

function PageReference({ sourceNodes, ...props }: PageReferenceProps) {
  let sources: Source[] = [];
  if (props["data-numbers"]) {
    sources = props["data-numbers"]
      .split(",")
      .map((n) => sourceNodes[Number(n.trim()) - 1]!)
      .filter(Boolean);
  } else if (props["data-number"]) {
    const number = props["data-number"];
    const idx = Number(number) - 1;
    sources = [sourceNodes[idx]!].filter(Boolean);
  }

  if (sources.length === 0) return null;

  return <SourceModal sources={sources} />;
}

export default PageReference;
