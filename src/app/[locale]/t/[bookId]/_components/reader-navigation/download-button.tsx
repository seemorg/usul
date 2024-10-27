import { Button } from "@/components/ui/button";
import type { TurathBookResponse } from "@/server/services/books";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

export default function DownloadButton({
  pdf,
  slug,
}: {
  pdf?: TurathBookResponse["turathResponse"]["pdf"] | null;
  slug: string;
}) {
  const t = useTranslations("reader");
  const tooltip = t("download-pdf");

  if (pdf?.finalUrl) {
    return (
      <Button
        variant="outline"
        size="icon"
        tooltip={tooltip}
        tooltipProps={{ side: "bottom" }}
        asChild
      >
        <a href={pdf?.finalUrl} download={slug + ".pdf"} target="_blank">
          <ArrowDownTrayIcon className="h-4 w-4" />
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      tooltip={tooltip}
      tooltipProps={{ side: "bottom" }}
      disabled
    >
      <ArrowDownTrayIcon className="h-4 w-4" />
    </Button>
  );
}
