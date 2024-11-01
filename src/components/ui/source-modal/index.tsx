/* eslint-disable react/jsx-key */
import { useCallback, useState } from "react";
import {
  Dialog,
  RawDialogClose,
  RawDialogContent,
  DialogOverlay,
  DialogPortal,
} from "../dialog";
import { XIcon } from "lucide-react";
import {
  DocumentDuplicateIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Separator } from "../separator";
import { Button } from "../button";
import { useTranslations } from "next-intl";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { toast } from "../use-toast";
import { useReaderVirtuoso } from "@/app/[locale]/t/[bookId]/_components/context";
import type { UsePageNavigationReturnType } from "@/app/[locale]/t/[bookId]/_components/usePageNavigation";

export default function SourceModal({
  source,
  getVirtuosoScrollProps,
}: {
  source: SemanticSearchBookNode;
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
}) {
  const t = useTranslations();
  const virtuosoRef = useReaderVirtuoso();
  const handleNavigateToPage = useCallback(
    (page?: { vol: string; page: number }) => {
      if (!page) return;

      // TODO: get index
      // const props = getVirtuosoScrollProps(page);
      // virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    },
    [getVirtuosoScrollProps],
  );

  const [isOpen, setIsOpen] = useState(false);

  const chapter = source.metadata.chapters[0];
  const page = source.metadata.pages[0]!;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(source.text);
    toast({
      title: t("reader.chat.copied"),
    });
  };

  const handleGoToPage = () => {
    handleNavigateToPage(page);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="mx-1 inline cursor-pointer rounded-md bg-muted p-1 text-xs transition-opacity hover:opacity-80"
        onClick={() => setIsOpen(true)}
      >
        {t("reader.chat.pg-x-vol", {
          page: page.page,
          vol: page.vol,
        })}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay>
            <RawDialogContent className="relative z-50 flex w-full max-w-xl flex-col bg-background p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] sm:rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <p dir="rtl">{chapter}</p>
                  <Separator
                    orientation="vertical"
                    className="h-1.5 w-1.5 rounded-full"
                  />
                  <p>
                    Page {page?.vol} / {page?.page}
                  </p>
                </div>

                <RawDialogClose className="rounded-sm p-2 text-muted-foreground ring-offset-background transition-colors hover:bg-accent/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                  <XIcon className="size-5" />
                  <span className="sr-only">Close</span>
                </RawDialogClose>
              </div>

              <Separator className="mb-6 mt-4" />

              <div
                className="max-h-96 w-full overflow-y-auto px-8"
                dir="rtl"
                dangerouslySetInnerHTML={{
                  __html: source.text.replaceAll("\n", "<br>"),
                }}
              />

              <Separator className="my-4" />

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleGoToPage}>
                  Go to page
                </Button>

                <div className="flex">
                  <Button
                    size="icon"
                    variant="ghost"
                    tooltip={t("reader.chat.copy")}
                    onClick={handleCopy}
                  >
                    <DocumentDuplicateIcon className="size-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    tooltip={t("reader.chat.share-chat")}
                  >
                    <ArrowUpOnSquareIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </RawDialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}
