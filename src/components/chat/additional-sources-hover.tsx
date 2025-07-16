import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SourceModal, SourceTrigger } from "@/components/ui/source-modal";

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
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState<
    AdditionalSourcesHoverProps["sourceNodes"][number] | null
  >(null);

  return (
    <>
      <HoverCard open={isHoverOpen} onOpenChange={setIsHoverOpen}>
        <HoverCardTrigger className="bg-muted cursor-pointer rounded-full px-2 py-0.5 text-xs">
          +{additionalSources.length}
        </HoverCardTrigger>
        <HoverCardContent className="z-10 p-2">
          <div className="flex flex-col gap-1">
            {additionalSources.map((sourceNumber) => {
              const idx = sourceNumber - 1;
              const sourceNode = sourceNodes[idx]!;

              return (
                <SourceTrigger
                  key={sourceNumber}
                  source={sourceNode}
                  onClick={() => setCurrentSource(sourceNode)}
                />
              );
            })}
          </div>
        </HoverCardContent>
      </HoverCard>

      {currentSource && (
        <SourceModal
          source={currentSource}
          isOpen
          onOpenChange={() => setCurrentSource(null)}
        />
      )}
    </>
  );
}
