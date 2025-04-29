import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  RawDialogClose,
  RawDialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { versionToName } from "@/lib/version";
import { usePathname, useRouter } from "@/navigation";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import PublicationDetails from "../publication-details";

const EditionItem = ({
  version,
  isSelected,
  onSelect,
  isLoading,
}: {
  version: PrismaJson.BookVersion;
  isSelected: boolean;
  onSelect: () => void;
  isLoading: boolean;
}) => {
  const t = useTranslations();

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between sm:items-center">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
          <h4 className="text-lg font-semibold sm:text-xl">
            {versionToName(version)}
          </h4>

          <div className="flex gap-2">
            {version.source === "openiti" ||
            version.source === "turath" ||
            (version.source === "pdf" && version.ocrBookId) ? (
              <Badge variant="muted">{t("common.e-book")}</Badge>
            ) : null}

            {version.source === "pdf" || version.pdfUrl ? (
              <Badge variant="muted">{t("common.pdf")}</Badge>
            ) : null}
          </div>
        </div>

        <Button
          variant={isSelected ? "outline" : "default"}
          disabled={isSelected || isLoading}
          onClick={onSelect}
          className="gap-2"
        >
          {isLoading && isSelected ? (
            <Spinner className="h-4 w-4 text-current" />
          ) : null}
          {isSelected ? t("reader.selected") : t("reader.select")}
        </Button>
      </div>

      <PublicationDetails
        className="mt-4 grid grid-cols-2 items-start gap-3 sm:mt-6 sm:flex sm:items-center sm:gap-6"
        publicationDetails={{
          publisher: version.publicationDetails?.publisher,
          investigator: version.publicationDetails?.investigator,
          editionNumber: version.publicationDetails?.editionNumber,
          publisherLocation: version.publicationDetails?.publisherLocation,
          publicationYear: version.publicationDetails?.publicationYear,
        }}
      />
    </div>
  );
};

export default function EditionModal({
  versions,
  versionId,
  open,
  onOpenChange,
}: {
  versions: PrismaJson.BookVersion[];
  versionId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [selectedVersion, setSelectedVersion] = useState(() => {
    const version = versionId
      ? versions.find((v) => v.id === versionId)?.id ?? versions[0]?.id
      : versions[0]?.id;

    return version;
  });
  const selectedVersionObj = versions.find((v) => v.id === selectedVersion);

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);

    const newParams = new URLSearchParams(searchParams);

    newParams.set("versionId", newVersion);
    const newUrl = `${pathname}?${newParams.toString()}`;

    startTransition(() => {
      push(newUrl);
      onOpenChange?.(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="place-items-end pt-10 pb-0 sm:place-items-center sm:pt-40 sm:pb-20">
          <RawDialogContent className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] relative z-50 grid w-full max-w-4xl shadow-lg duration-200 sm:rounded-lg">
            <div className="flex w-full items-center justify-between px-6 py-5">
              <div>
                <DialogTitle>{t("reader.editions-modal.title")}</DialogTitle>

                <DialogDescription className="mt-1">
                  {t("reader.editions-modal.description")}
                </DialogDescription>
              </div>

              <RawDialogClose className="ring-offset-background hover:bg-secondary/50 focus:ring-ring rounded-sm p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                <XIcon className="size-5" />
                <span className="sr-only">Close</span>
              </RawDialogClose>
            </div>

            <Separator />

            <div className="divide-border w-full divide-y">
              {versions.map((version) => (
                <EditionItem
                  key={version.id}
                  version={version}
                  isSelected={version.id === selectedVersionObj?.id}
                  onSelect={() => handleVersionChange(version.id)}
                  isLoading={isPending}
                />
              ))}
            </div>
          </RawDialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
