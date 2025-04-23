import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getBookPageIndex } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import { ScrollArea } from "../scroll-area";
import { useBookShareUrl } from "@/lib/share";
import Spinner from "../spinner";
import { useBookDetails } from "@/app/[locale]/t/[bookId]/_contexts/book-details.context";

export default function SourceModal({
  source,
  getVirtuosoScrollProps,
}: {
  source: SemanticSearchBookNode;
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
}) {
  const { bookResponse } = useBookDetails();
  const [isOpen, setIsOpen] = useState(false);
  const slug = useParams().bookId as string;
  const versionId = useSearchParams().get("versionId");
  const { copyUrl: copyShareUrl } = useBookShareUrl();

  const t = useTranslations();
  const virtuosoRef = useReaderVirtuoso();

  const chapterIndex = source.metadata.chapters[0];
  const chapter =
    chapterIndex !== undefined && "headings" in bookResponse.content
      ? bookResponse.content.headings?.[chapterIndex]?.title
      : undefined;

  const page = source.metadata.pages[0]!;

  const { isPending, data } = useQuery({
    queryKey: ["page", slug, page.page, page.volume, versionId] as const,
    queryFn: async ({ queryKey }) => {
      const [, _slug, pg, vol, version] = queryKey;

      const result = await getBookPageIndex(_slug, {
        page: pg,
        volume: vol,
        versionId: version ?? undefined,
      });

      if (!result || "type" in result) {
        return null;
      }

      return result;
    },
    enabled: isOpen && !!page,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(source.text);
    toast({
      title: t("reader.chat.copied"),
    });
  };

  const handleShare = async () => {
    if (!data || data.index === null) return;

    await copyShareUrl({
      slug,
      pageIndex: data.index,
      versionId: versionId ?? undefined,
    });
  };

  const handleGoToPage = () => {
    if (!data || data.index === null) return;

    const props = getVirtuosoScrollProps(data.index);
    virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });

    setIsOpen(false);
  };

  return (
    <>
      <button
        className="inline cursor-pointer rounded-md bg-muted p-1 text-xs"
        onClick={() => setIsOpen(true)}
      >
        {t("reader.chat.pg-x-vol", {
          page: page.page,
          vol: page.volume,
        })}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay>
            <RawDialogContent className="relative z-50 flex w-full max-w-xl flex-col bg-background px-6 py-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] sm:rounded-lg">
              <div className="flex items-center justify-between">
                <RawDialogClose className="rounded-sm p-2 text-muted-foreground ring-offset-background transition-colors hover:bg-accent/70 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                  <XIcon className="size-5" />
                  <span className="sr-only">Close</span>
                </RawDialogClose>

                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <p dir="rtl">{chapter}</p>
                </div>
              </div>

              <Separator className="mb-6 mt-4" />

              <ScrollArea className="h-96 w-full pl-5" dir="rtl">
                <p
                  dangerouslySetInnerHTML={{
                    __html: source.text.replaceAll("\n", "<br>"),
                  }}
                />
              </ScrollArea>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleGoToPage}
                  disabled={isPending}
                >
                  {isPending
                    ? "Loading..."
                    : t("reader.go-to-page-x", {
                        vol: page.volume,
                        page: page.page,
                      })}
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
                    onClick={handleShare}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Spinner className="size-5" />
                    ) : (
                      <ArrowUpOnSquareIcon className="size-5" />
                    )}
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
