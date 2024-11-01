"use client";

import Container from "@/components/ui/container";
import VersionSelector from "./version-selector";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
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

  const versionId = bookResponse.content.versionId;

  const pdf =
    bookResponse.content.source === "turath"
      ? bookResponse.content.pdf
      : undefined;

  return (
    <>
      <div
        className={cn(
          "relative z-[10] w-full bg-reader transition will-change-transform",
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0",
        )}
      >
        <Container className="mx-auto flex items-center justify-between border-b border-border px-5 py-2.5 lg:px-8 2xl:max-w-5xl">
          <div className="flex items-center gap-2">
            <ReaderNavigationMobileActions
              isSinglePage={isSinglePage ?? false}
              pdf={pdf}
              slug={bookSlug}
            />

            <VersionSelector
              versions={bookResponse.book.versions}
              versionId={bookResponse.content.versionId}
            />
          </div>

          <ViewTabs hasPdf={!!pdf?.finalUrl} />

          <div className="hidden items-center gap-3 md:flex">
            <DownloadButton pdf={pdf} slug={bookSlug} />

            <ReaderNavigationButton
              tooltip={t(isSinglePage ? "all-pages" : "single-page")}
              tooltipProps={{ side: "bottom" }}
              asChild
            >
              <Link href={bookUrl}>
                <SinglePageIcon className="size-4" />
              </Link>
            </ReaderNavigationButton>
          </div>

          <div className="flex flex-row-reverse items-center gap-1 md:hidden">
            {tabs.map((tab) => (
              <ReaderNavigationButton
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
              >
                <tab.icon className="size-4" />
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
