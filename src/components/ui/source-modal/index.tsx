import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useReaderVirtuoso } from "@/app/[locale]/t/[bookId]/_components/context";
import { useBookDetails } from "@/app/[locale]/t/[bookId]/_contexts/book-details.context";
import { getBookPageIndex } from "@/lib/api";
import { useBookShareUrl } from "@/lib/share";
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
import Spinner from "../spinner";

// Sub-component for the modal header
function SourceModalHeader({
  chapter,
  pageReference,
  onClose,
}: {
  chapter?: string;
  pageReference: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <DialogTitle className="sr-only">Source</DialogTitle>
      <DialogDescription className="sr-only">{pageReference}</DialogDescription>

      <RawDialogClose
        className="text-muted-foreground ring-offset-background hover:bg-accent/70 focus:ring-ring rounded-sm p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
        onClick={onClose}
      >
        <XIcon className="size-5" />
        <span className="sr-only">Close</span>
      </RawDialogClose>

      <div className="text-muted-foreground flex items-center gap-2 text-base">
        <p dir="rtl">{chapter}</p>
      </div>
    </div>
  );
}

// Sub-component for the modal content
function SourceModalContent({
  source,
  isPending,
  pageReference,
}: {
  source: SemanticSearchBookNode;
  isPending: boolean;
  pageReference: string;
}) {
  return (
    <>
      <ScrollArea className="h-96 w-full pl-5" dir="rtl">
        <p
          dangerouslySetInnerHTML={{
            __html: source.text.replaceAll("\n", "<br>"),
          }}
        />
      </ScrollArea>

      <Separator className="my-4" />
    </>
  );
}

// Sub-component for the modal actions
function SourceModalActions({
  isPending,
  page,
  onGoToPage,
  onCopy,
  onShare,
}: {
  isPending: boolean;
  page: { page: number; volume: string };
  onGoToPage: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onGoToPage} disabled={isPending}>
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
          onClick={onCopy}
        >
          <DocumentDuplicateIcon className="size-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          tooltip={t("reader.chat.share-chat")}
          onClick={onShare}
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
  );
}

// Hook for book details - only called when slug is defined
function useBookDetailsConditional(slug?: string) {
  if (!slug) {
    return { bookResponse: null };
  }

  return useBookDetails();
}

// Hook for page data - only called when slug is defined
function usePageDataConditional(
  slug: string | undefined,
  page: { page: number; volume: string } | undefined,
  isOpen: boolean,
  versionId?: string | null,
) {
  if (!slug || !page) {
    return { isPending: false, data: null };
  }

  return useQuery({
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
}

export default function SourceModal({
  source,
}: {
  source: SemanticSearchBookNode & {
    book?: { slug: string; primaryName: string };
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMobileSidebar = useMobileReaderStore((s) => s.closeMobileSidebar);
  const slug = useParams().bookId as string;
  const versionId = useSearchParams().get("versionId");
  const { copyUrl: copyShareUrl } = useBookShareUrl();

  const t = useTranslations();
  const virtuosoRef = useReaderVirtuoso();

  // Only call useBookDetails when slug is defined
  const { bookResponse } = useBookDetailsConditional(slug);

  const page = source.metadata.pages[0]!;

  // Only call usePageData when slug is defined
  const { isPending, data } = usePageDataConditional(
    slug,
    page,
    isOpen,
    versionId,
  );

  // Only get chapter info when bookResponse is available
  const chapterIndex = source.metadata.chapters[0];
  const chapter =
    chapterIndex !== undefined &&
    bookResponse &&
    "headings" in bookResponse.content
      ? bookResponse.content.headings?.[chapterIndex]?.title
      : undefined;

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

    const props = {
      index: data.index,
      align: "center" as const,
    };

    virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });

    setIsOpen(false);
    closeMobileSidebar();
  };

  const pageReference = t("reader.chat.pg-x-vol", {
    page: page.page,
    vol: page.volume,
  });

  return (
    <>
      <button
        className="bg-muted mx-0.5 inline cursor-pointer rounded-md p-1 text-xs"
        onClick={() => setIsOpen(true)}
      >
        {source.book ? source.book.primaryName : pageReference}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay>
            <RawDialogContent className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] relative z-50 flex w-full max-w-xl flex-col px-6 py-4 shadow-lg duration-200 sm:rounded-lg">
              <SourceModalHeader
                chapter={chapter}
                pageReference={pageReference}
                onClose={() => setIsOpen(false)}
              />

              <Separator className="mt-4 mb-6" />

              <SourceModalContent
                source={source}
                isPending={isPending}
                pageReference={pageReference}
              />

              <Separator className="my-4" />

              <SourceModalActions
                isPending={isPending}
                page={page}
                onGoToPage={handleGoToPage}
                onCopy={handleCopy}
                onShare={handleShare}
              />
            </RawDialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}
