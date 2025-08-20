import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useReaderVirtuoso } from "@/app/[locale]/t/[bookId]/_components/context";
import { ShinyText } from "@/components/shiny-text";
import { usePathLocale } from "@/lib/locale/utils";
import { convertPageToHtml } from "@/lib/reader";
import { useBookShareUrl } from "@/lib/share";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { translateChunk } from "@/server/services/chat";
import { useMobileReaderStore } from "@/stores/mobile-reader";
import {
  ArrowUpOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Source } from ".";
import { Button } from "../button";
import Spinner from "../spinner";
import { SourceTitle } from "./source-title";

const SourceItem = ({
  source,
  onOpenChange,
}: {
  source: Source;
  onOpenChange: (open: boolean) => void;
}) => {
  const router = useRouter();
  const closeMobileSidebar = useMobileReaderStore((s) => s.closeMobileSidebar);
  const params = useParams();
  const slugParam = params.bookId as string | undefined;
  const isSinglePageReader = !!params.pageNumber;

  const versionId = useSearchParams().get("versionId");
  const { copyUrl: copyShareUrl, getUrl: getShareUrl } = useBookShareUrl();

  const t = useTranslations();
  const virtuosoRef = useReaderVirtuoso();
  const pathLocale = usePathLocale();

  const [showOriginal, setShowOriginal] = useState(true);

  const {
    data: oldTranslatedText,
    mutateAsync: runTranslate,
    isPending: isTranslating,
  } = useMutation<{ text: string }, Error, void>({
    mutationKey: source.id ? ["translate-chunk", source.id] : undefined,
    mutationFn: async () => {
      const res = await translateChunk({
        text: source.text,
        locale: pathLocale,
      });
      if (!res) throw new Error("Failed to translate");
      return res;
    },
    onError: () => {
      toast.error(t("reader.chat.error"));
    },
    onSuccess: (res) => {
      setTranslatedText(res.text);
      setShowOriginal(false);
    },
  });

  const firstPage = source.metadata.pages[0]!;
  const [translatedText, setTranslatedText] = useState<string | null>(
    oldTranslatedText?.text ?? null,
  );
  const displayedText =
    !translatedText || showOriginal ? source.text : translatedText;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayedText);
    toast.success(t("reader.chat.copied"));
  };

  const handleShare = async () => {
    const slug = source.book?.slug ?? slugParam;
    if (!slug) return;

    await copyShareUrl({
      slug,
      pageIndex: firstPage.index,
      versionId: versionId ?? undefined,
    });
  };

  const handleGoToPage = () => {
    if (!slugParam) return; // if this is in the chat page, we don't need to go to the page

    if (isSinglePageReader) {
      const url = getShareUrl({
        slug: slugParam,
        pageIndex: firstPage.index,
        versionId: versionId ?? undefined,
      });

      router.push(url);
    } else {
      const props = {
        index: firstPage.index,
        align: "center" as const,
      };

      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
      onOpenChange(false);
      closeMobileSidebar();
    }
  };

  const url = slugParam
    ? null
    : getShareUrl({
        slug: source.book?.slug!,
        pageIndex: firstPage.index,
        versionId: versionId ?? undefined,
      });

  const textLabel = t("reader.go-to-page-x", {
    vol: firstPage.volume,
    page: firstPage.page,
  });

  const content = (
    <bdi
      className={cn(
        "flex flex-col gap-3",
        isTranslating
          ? "[&_.footnotes]:text-muted-foreground/70"
          : "[&_.footnotes]:text-muted-foreground",
      )}
      dangerouslySetInnerHTML={{
        __html: convertPageToHtml(displayedText),
      }}
    />
  );

  return (
    <div className="flex flex-col gap-3 px-6 py-6">
      <div className="text-muted-foreground text-lg font-medium">
        <SourceTitle source={source} />
      </div>

      <div className="h-2" />

      {isTranslating ? (
        <ShinyText shimmerWidth={200} className="[animation-duration:1.5s]">
          {content}
        </ShinyText>
      ) : (
        content
      )}

      <div>
        <Button
          variant="link"
          className="px-0"
          disabled={isTranslating}
          onClick={async () => {
            if (translatedText) {
              setShowOriginal((v) => !v);
              return;
            }
            await runTranslate();
          }}
        >
          {translatedText && !showOriginal
            ? t("reader.chat.show-original")
            : t("reader.chat.translate")}
          {isTranslating && <Spinner className="size-3" />}
        </Button>
      </div>

      <div className="mt-4 flex justify-between">
        <Button variant="outline" onClick={handleGoToPage} asChild={!!url}>
          {url ? <Link href={url}>{textLabel}</Link> : textLabel}
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
            tooltip={t("reader.share")}
            onClick={handleShare}
          >
            <ArrowUpOnSquareIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SourceItem;
