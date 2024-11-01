import type { ButtonProps } from "@/components/ui/button";
import type { TurathBookResponse } from "@/server/services/books";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import ReaderNavigationButton from "./navigation-button";

export default function DownloadButton({
  pdf,
  slug,
}: {
  pdf?: TurathBookResponse["turathResponse"]["pdf"] | null;
  slug: string;
}) {
  const t = useTranslations("reader");
  const tooltip = t("download-pdf");

  const commonProps: Partial<ButtonProps> = {
    tooltip,
    tooltipProps: { side: "bottom" },
  };

  if (pdf?.finalUrl) {
    return (
      <ReaderNavigationButton {...commonProps} asChild>
        <a href={pdf?.finalUrl} download={slug + ".pdf"} target="_blank">
          <ArrowDownTrayIcon className="h-4 w-4" />
        </a>
      </ReaderNavigationButton>
    );
  }

  return (
    <ReaderNavigationButton {...commonProps} disabled>
      <ArrowDownTrayIcon className="h-4 w-4" />
    </ReaderNavigationButton>
  );
}
