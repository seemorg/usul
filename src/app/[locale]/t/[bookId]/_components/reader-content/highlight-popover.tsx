import { ClipboardIcon, ShareIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/lib/locale/utils";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useChatStore } from "../../_stores/chat";
import { useTabNavigate } from "../sidebar/useTabNavigate";
import { useBookShareUrl } from "@/lib/share";

function ReaderHighlightPopover({
  selection,
  pageIndex,
}: {
  selection: string;
  pageIndex: number;
}) {
  const dir = useDirection();
  const t = useTranslations();
  const { copyUrl: copyShareUrl } = useBookShareUrl();

  const { handleNavigate } = useTabNavigate();

  const setQuestion = useChatStore((s) => s.setQuestion);

  const bookSlug = useParams().bookId as string;
  const versionId = useSearchParams().get("versionId") as string;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selection);
    toast({ description: t("reader.chat.copied") });
  };

  const handleShare = async () => {
    await copyShareUrl({
      slug: bookSlug,
      pageIndex,
      versionId,
      selection,
    });
  };

  const handleAskAI = () => {
    handleNavigate("ai");
    setQuestion(`> ${selection}\n\n`);
  };

  return (
    <div
      className="overflow-hidden rounded-lg bg-[#232324] font-sans text-[#E5E5E6] shadow-lg"
      dir={dir}
    >
      <Button
        variant="ghost"
        className="h-10 gap-2 rounded-none hover:bg-accent/10 focus:bg-accent/10"
        onClick={handleCopy}
      >
        <ClipboardIcon className="size-4" />
        {t("reader.copy")}
      </Button>

      <Button
        variant="ghost"
        className="h-10 gap-2 rounded-none hover:bg-accent/10 focus:bg-accent/10"
        onClick={handleShare}
      >
        <ShareIcon className="size-4" />
        {t("reader.share")}
      </Button>

      <Button
        variant="ghost"
        className="h-10 gap-2 rounded-none hover:bg-accent/10 focus:bg-accent/10"
        onClick={handleAskAI}
      >
        <SparklesIcon className="size-4" />
        {t("reader.ask-ai")}
      </Button>
    </div>
  );
}

export default ReaderHighlightPopover;
