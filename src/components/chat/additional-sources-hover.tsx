import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} closeDelay={100}>
      <HoverCardTrigger className="bg-muted cursor-pointer rounded-full px-2 py-0.5 text-xs">
        +{additionalSources.length}
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
