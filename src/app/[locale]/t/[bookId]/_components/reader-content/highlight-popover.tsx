import { ClipboardIcon, ShareIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDirection, usePathLocale } from "@/lib/locale/utils";
import { toast } from "@/components/ui/use-toast";
import { useLocale, useTranslations } from "next-intl";
import { navigation } from "@/lib/urls";
import { useParams, useSearchParams } from "next/navigation";
import { defaultLocale } from "~/i18n.config";

function ReaderHighlightPopover({
  selection,
  pageIndex,
}: {
  selection: string;
  pageIndex: number;
}) {
  const dir = useDirection();
  const t = useTranslations();
  const pathLocale = usePathLocale();
  const locale = useLocale();

  const bookSlug = useParams().bookId as string;
  const versionId = useSearchParams().get("versionId") as string;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selection);
    toast({ description: t("reader.chat.copied") });
  };

  const handleShare = async () => {
    let url =
      window.location.origin +
      navigation.books.pageReader(bookSlug, pageIndex + 1);

    if (locale !== defaultLocale) url = pathLocale + url;
    if (versionId) url = url + `?versionId=${versionId}`;

    // add selection to url via browser query params
    url = url + `#:~:text=${encodeURIComponent(selection)}`;

    await navigator.clipboard.writeText(url);

    toast({ description: t("reader.chat.copied") });
  };

  return (
    <div
      className="overflow-hidden rounded-md border border-border bg-background font-sans shadow-lg"
      dir={dir}
    >
      <Button
        variant="ghost"
        className="h-10 gap-2 hover:bg-accent focus:bg-accent"
        onClick={handleCopy}
      >
        <ClipboardIcon className="size-4" />
        Copy
      </Button>

      <Button
        variant="ghost"
        className="h-10 gap-2 hover:bg-accent focus:bg-accent"
        onClick={handleShare}
      >
        <ShareIcon className="size-4" />
        Share
      </Button>

      <Button
        variant="ghost"
        className="h-10 gap-2 hover:bg-accent focus:bg-accent"
      >
        <SparklesIcon className="size-4" />
        Ask AI
      </Button>
    </div>
  );
}

export default ReaderHighlightPopover;
