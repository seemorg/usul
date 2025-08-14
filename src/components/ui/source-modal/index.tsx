import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useState } from "react";
import { truncate } from "@/lib/string";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  RawDialogClose,
  RawDialogContent,
} from "../dialog";
import { ScrollArea } from "../scroll-area";
import { Separator } from "../separator";
import SourceItem from "./source-item";

export type Source = SemanticSearchBookNode & {
  book?: { slug: string; primaryName: string };
};

export function SourceModal({
  sources,
  isOpen,
  onOpenChange,
}: {
  sources: Source[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay>
          <RawDialogContent className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] relative z-50 flex w-full max-w-2xl flex-col py-4 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex items-center justify-between px-6">
              <DialogTitle>{sources.length} Sources</DialogTitle>
              <DialogDescription className="sr-only">Source</DialogDescription>

              <RawDialogClose
                className="text-muted-foreground ring-offset-background hover:bg-accent/70 focus:ring-ring rounded-sm p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
                onClick={() => onOpenChange(false)}
              >
                <XIcon className="size-5" />
                <span className="sr-only">Close</span>
              </RawDialogClose>
            </div>

            <Separator className="mt-4" />

            <ScrollArea className="h-[450px] w-full">
              <div className="divide-border flex flex-col divide-y-2">
                {sources.map((source, idx) => (
                  <SourceItem
                    key={idx}
                    source={source}
                    onOpenChange={onOpenChange}
                  />
                ))}
              </div>
            </ScrollArea>
          </RawDialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

export default function DefaultSourceModal({ sources }: { sources: Source[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const primarySource = sources[0]!;
  const extraCount = sources.length - 1;
  const page = primarySource.metadata.pages[0]!;

  return (
    <>
      <button
        className="bg-muted mx-0.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs"
        onClick={() => setIsOpen(true)}
      >
        {primarySource.book
          ? truncate(primarySource.book.primaryName, 35)
          : t("reader.chat.pg-x-vol", {
              page: page.page,
              vol: page.volume,
            })}

        {extraCount > 0 ? (
          <>
            <Separator orientation="vertical" className="h-2.5" />
            <span className="text-xs">+{extraCount}</span>
          </>
        ) : null}
      </button>

      <SourceModal sources={sources} isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
