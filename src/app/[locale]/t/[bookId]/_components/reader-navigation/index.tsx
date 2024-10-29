"use client";

import Container from "@/components/ui/container";
import VersionSelector from "./version-selector";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import { Button } from "@/components/ui/button";
import { ExpandIcon } from "lucide-react";
import DownloadButton from "./download-button";
import ViewTabs from "./view-tabs";
import BookInfoHeader from "./book-info-header";
import { useNavbarStore } from "@/stores/navbar";
import { cn } from "@/lib/utils";

export default function ReaderNavigation({
  bookResponse,
}: {
  bookResponse: ApiBookResponse;
}) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);

  return (
    <>
      <div
        className={cn(
          "bg-reader relative z-[10] w-full transition will-change-transform",
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0",
        )}
      >
        <Container className="mx-auto flex items-center justify-between border-b border-border px-5 py-2.5 lg:px-8 2xl:max-w-5xl">
          <VersionSelector
            versions={bookResponse.book.versions}
            versionId={bookResponse.content.versionId}
          />

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

      <BookInfoHeader bookResponse={bookResponse} />
    </>
  );
}
