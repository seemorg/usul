import Container from "@/components/ui/container";
import VersionSelector from "./version-selector";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import { Button } from "@/components/ui/button";
import { ExpandIcon } from "lucide-react";
import DownloadButton from "./download-button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import ViewTabs from "./view-tabs";

export default function ReaderNavigation({
  bookResponse,
}: {
  bookResponse: ApiBookResponse;
}) {
  const t = useTranslations("reader");

  return (
    <div className="relative z-[10] w-full border-b-2 border-border bg-white py-3">
      <Container className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="flex h-9 items-center justify-center border border-border bg-secondary px-4 ltr:rounded-l-md rtl:rounded-r-md">
            <Label htmlFor="version-selector" className="font-normal">
              {t("version")}
            </Label>
          </div>

          <VersionSelector
            versions={bookResponse.book.versions}
            versionId={bookResponse.content.versionId}
          />
        </div>

        <ViewTabs
          hasPdf={
            bookResponse.content.source === "turath" &&
            !!bookResponse.content.pdf?.finalUrl
          }
        />

        <div className="flex items-center gap-3">
          <DownloadButton
            pdf={
              bookResponse.content.source === "turath"
                ? bookResponse.content.pdf
                : undefined
            }
            slug={bookResponse.book.slug}
          />

          <Button size="icon" variant="outline">
            <ExpandIcon className="size-4" />
          </Button>
        </div>
      </Container>
    </div>
  );
}
