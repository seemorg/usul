import { SinglePageIcon } from "@/components/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { EllipsisIcon, FileText } from "lucide-react";
import ReaderNavigationButton from "./navigation-button";
import { useGetBookUrl, useReaderView } from "./utils";
import { useTranslations } from "next-intl";
import type { TurathBookResponse } from "@/server/services/books";
import { Link } from "@/navigation";

export default function ReaderNavigationMobileActions({
  pdf,
  slug,
  isSinglePage,
}: {
  pdf?: TurathBookResponse["turathResponse"]["pdf"] | null;
  slug: string;
  isSinglePage?: boolean;
}) {
  const { view, setView } = useReaderView();
  const t = useTranslations("reader");
  const bookUrl = useGetBookUrl(isSinglePage ? undefined : 1);

  const hasPdfView = !!pdf?.finalUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ReaderNavigationButton className="md:hidden">
          <EllipsisIcon />
        </ReaderNavigationButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40 ltr:ml-3 rtl:mr-3">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={!hasPdfView}
            onClick={() => setView(view === "pdf" ? "ebook" : "pdf")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>{t(view === "pdf" ? "view-e-book" : "view-pdf")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="gap-2">
            <Link href={bookUrl}>
              <SinglePageIcon className="h-4 w-4" />
              <span>{t(isSinglePage ? "all-pages" : "single-page")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {pdf?.finalUrl ? (
            <DropdownMenuItem asChild className="gap-2">
              <a href={pdf?.finalUrl} download={slug + ".pdf"} target="_blank">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>{t("download-pdf")}</span>
              </a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled className="gap-2">
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{t("download-pdf")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
