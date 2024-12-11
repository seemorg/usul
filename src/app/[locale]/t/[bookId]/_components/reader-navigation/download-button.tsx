import type { ButtonProps } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import ReaderNavigationButton from "./navigation-button";
import type { TurathContent } from "@/types/api/content/turath";

export default function DownloadButton({
  pdf,
  slug,
}: {
  pdf?: TurathContent["pdf"];
  slug: string;
}) {
  const t = useTranslations("reader");
  const tooltip = t("download-pdf");

  const commonProps: Partial<ButtonProps> = {
    tooltip,
    tooltipProps: { side: "bottom" },
  };

  if (pdf && "fullBookUrl" in pdf) {
    return (
      <ReaderNavigationButton {...commonProps} asChild>
        <a href={pdf.fullBookUrl} download={slug + ".pdf"} target="_blank">
          <ArrowDownTrayIcon />
        </a>
      </ReaderNavigationButton>
    );
  }

  return (
    <ReaderNavigationButton {...commonProps} disabled>
      <ArrowDownTrayIcon />
    </ReaderNavigationButton>
  );
}
