import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useReaderVirtuoso } from "@/app/[locale]/t/[bookId]/_components/context";
import { useBookDetails } from "@/app/[locale]/t/[bookId]/_contexts/book-details.context";
import { getBookPageIndex } from "@/lib/api";
import { useBookShareUrl } from "@/lib/share";
import { truncate } from "@/lib/string";
import { useRouter } from "@/navigation";
import { useMobileReaderStore } from "@/stores/mobile-reader";
import {
  ArrowUpOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "../button";
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

type Source = SemanticSearchBookNode & {
  book?: { slug: string; primaryName: string };
};

function SourceTitle({ source }: { source: Source }) {
  const slugParam = useParams().bookId as string;
  if (!slugParam) {
    if (source.book) {
      return <p>{source.book.primaryName}</p>;
    }
  }

  return <SourceTitleInner source={source} />;
}

function SourceTitleInner({ source }: { source: Source }) {
  const { bookResponse } = useBookDetails();

  // Only get chapter info when bookResponse is available
  const chapterIndex = source.metadata.chapters[0];
  const chapter =
    chapterIndex !== undefined && "headings" in bookResponse.content
      ? bookResponse.content.headings?.[chapterIndex]?.title
      : undefined;

  return chapter ? <p dir="rtl">{chapter}</p> : null;
}

export default function SourceModal({ source }: { source: Source }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const closeMobileSidebar = useMobileReaderStore((s) => s.closeMobileSidebar);
  const slugParam = useParams().bookId as string;
  const slug = source.book?.slug ?? slugParam;
  const versionId = useSearchParams().get("versionId");
  const { copyUrl: copyShareUrl, getUrl: getShareUrl } = useBookShareUrl();

  const t = useTranslations();
  const virtuosoRef = useReaderVirtuoso();

  const page = source.metadata.pages[0]!;

  // Only call usePageData when slug is defined
  const { isPending, data } = useQuery({
    queryKey: ["page", slug, page, versionId] as const,
    queryFn: async ({ queryKey }) => {
      const [, _slug, pg, version] = queryKey;

      const result = await getBookPageIndex(_slug, {
        page: pg.page,
        volume: pg.volume,
        versionId: version ?? undefined,
      });

      if (!result || "type" in result) {
        return null;
      }

      return result;
    },
    enabled: isOpen && !!slug,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(source.text);
    toast.success(t("reader.chat.copied"));
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

    if (slugParam) {
      const props = {
        index: data.index,
        align: "center" as const,
      };

      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
      setIsOpen(false);
      closeMobileSidebar();
    } else {
      const url = getShareUrl({
        slug,
        pageIndex: data.index,
        versionId: versionId ?? undefined,
      });

      router.push(url);
    }
  };

  const pageReference = t("reader.chat.pg-x-vol", {
    page: page.page,
    vol: page.volume,
  });

  return (
    <>
      <button
        className="bg-muted mx-0.5 inline cursor-pointer rounded-full px-2.5 py-0.5 text-xs"
        onClick={() => setIsOpen(true)}
      >
        {source.book ? truncate(source.book.primaryName, 35) : pageReference}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay>
            <RawDialogContent className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] relative z-50 flex w-full max-w-xl flex-col px-6 py-4 shadow-lg duration-200 sm:rounded-lg">
              <div className="flex items-center justify-between">
                <DialogTitle className="sr-only">Source</DialogTitle>
                <DialogDescription className="sr-only">
                  {pageReference}
                </DialogDescription>

                <RawDialogClose
                  className="text-muted-foreground ring-offset-background hover:bg-accent/70 focus:ring-ring rounded-sm p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="size-5" />
                  <span className="sr-only">Close</span>
                </RawDialogClose>

                <div className="text-muted-foreground flex items-center gap-2 text-base">
                  <SourceTitle source={source} />
                </div>
              </div>

              <Separator className="mt-4 mb-6" />

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
                    isLoading={isPending}
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
