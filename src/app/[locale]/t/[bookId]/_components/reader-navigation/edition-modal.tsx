import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  RawDialogClose,
  RawDialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useState, useTransition } from "react";
import PublicationDetails from "../publication-details";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { versionToName } from "@/lib/version";
import Spinner from "@/components/ui/spinner";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-semibold">{versionToName(version)}</h4>

          {version.source === "openiti" || version.source === "turath" ? (
            <Badge variant="muted">{t("common.e-book")}</Badge>
          ) : null}

          {version.source === "pdf" || version.pdfUrl ? (
            <Badge variant="muted">{t("common.pdf")}</Badge>
          ) : null}
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
        className="mt-6"
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
        <DialogOverlay>
          <RawDialogContent className="relative z-50 grid w-full max-w-4xl bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] sm:rounded-lg">
            <div className="flex w-full items-center justify-between px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold">
                  {t("reader.editions-modal.title")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("reader.editions-modal.description")}
                </p>
              </div>

              <RawDialogClose className="rounded-sm p-2 opacity-70 ring-offset-background transition-opacity hover:bg-secondary/50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <XIcon className="size-5" />
                <span className="sr-only">Close</span>
              </RawDialogClose>
            </div>

            <Separator />

            <div className="w-full">
              {versions.map((version, index) => (
                <Fragment key={version.id}>
                  <EditionItem
                    version={version}
                    isSelected={version.id === selectedVersionObj?.id}
                    onSelect={() => handleVersionChange(version.id)}
                    isLoading={isPending}
                  />

                  {index < versions.length - 1 && <Separator />}
                </Fragment>
              ))}
            </div>
          </RawDialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
