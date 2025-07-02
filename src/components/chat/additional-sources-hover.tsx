import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import PageReference from "./page-reference";

interface AdditionalSourcesHoverProps {
  additionalSources: number[];
  sourceNodes: (SemanticSearchBookNode & {
    book?: { slug: string; primaryName: string };
  })[];
}

export default function AdditionalSourcesHover({
  additionalSources,
  sourceNodes,
}: AdditionalSourcesHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="text-muted-foreground cursor-pointer">
          (+{additionalSources.length})
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="p-2">
        <div className="flex flex-col gap-1">
          {additionalSources.map((sourceNumber) => (
            <PageReference
              key={sourceNumber}
              data-number={sourceNumber.toString()}
              sourceNodes={sourceNodes}
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
