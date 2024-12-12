"use client";

import Container from "@/components/ui/container";
import VersionSelector from "./version-selector";
import type { ApiBookResponse } from "@/types/api/book";
import DownloadButton from "./download-button";
import ViewTabs from "./view-tabs";
import BookInfoHeader from "./book-info-header";
import { useNavbarStore } from "@/stores/navbar";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import ReaderNavigationMobileActions from "./mobile-actions";
import { SinglePageIcon } from "@/components/Icons";
import ReaderNavigationButton from "./navigation-button";
import { useTranslations } from "next-intl";
import { useGetBookUrl } from "./utils";
import { TabContent } from "../tab-content";
import { tabs } from "../sidebar/tabs";
import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export default function ReaderNavigation({
  bookResponse,
  isSinglePage,
}: {
  bookResponse: ApiBookResponse;
  isSinglePage?: boolean;
}) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const bookSlug = bookResponse.book.slug;
  const t = useTranslations("reader");
  const bookUrl = useGetBookUrl(isSinglePage ? undefined : 1);
  const [activeTabId, setActiveTabId] = useState<
    (typeof tabs)[number]["id"] | null
  >(null);

  const versionId = bookResponse.content.id;

  const pdf =
    "pdfUrl" in bookResponse.content ? bookResponse.content.pdfUrl : undefined;

  return (
    <>
      <div
        className={cn(
          "relative w-full bg-reader px-5 transition will-change-transform lg:px-8",
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0",
        )}
      >
        <Container className="flex items-center justify-between border-b border-border px-0 py-2.5 2xl:max-w-5xl">
          <div className="flex flex-1 items-center gap-2">
            <ReaderNavigationMobileActions
              isSinglePage={isSinglePage ?? false}
              pdf={pdf}
              slug={bookSlug}
            />

            <VersionSelector
              versions={bookResponse.book.versions}
              versionId={bookResponse.content.id}
            />
          </div>

          <div className="flex flex-1 justify-center">
            <ViewTabs hasPdf={!!pdf} />
          </div>

          <div className="hidden flex-1 items-center gap-2 md:flex md:justify-end">
            <DownloadButton pdf={pdf} slug={bookSlug} />

            <ReaderNavigationButton
              tooltip={t(isSinglePage ? "all-pages" : "single-page")}
              tooltipProps={{ side: "bottom" }}
              asChild
            >
              <Link href={bookUrl}>
                <SinglePageIcon />
              </Link>
            </ReaderNavigationButton>
          </div>

          <div className="flex flex-row-reverse items-center gap-1 md:hidden">
            {tabs.map((tab) => (
              <ReaderNavigationButton
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
              >
                <tab.icon />
              </ReaderNavigationButton>
            ))}

            <Drawer
              open={!!activeTabId}
              onOpenChange={(state) => {
                if (!state) {
                  setActiveTabId(null);
                }
              }}
            >
              <DrawerContent>
                {activeTabId && (
                  <div className="h-[85vh] w-full overflow-y-auto">
                    <TabContent
                      tabId={activeTabId}
                      bookSlug={bookSlug}
                      versionId={versionId}
                      isSinglePage={isSinglePage}
                      bookResponse={bookResponse}
                    />
                  </div>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </Container>
      </div>

      <BookInfoHeader bookResponse={bookResponse} />
    </>
  );
}
