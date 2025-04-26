"use client";

import type { ApiBookResponse } from "@/types/api/book";

import { SinglePageIcon } from "@/components/Icons";
import Container from "@/components/ui/container";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useNavbarStore } from "@/stores/navbar";
import { useTranslations } from "next-intl";

import { useBookDetails } from "../../_contexts/book-details.context";
import { tabs } from "../sidebar/tabs";
import { TabContent } from "../tab-content";
import BookInfoHeader from "./book-info-header";
import DownloadButton from "./download-button";
import ReaderNavigationMobileActions from "./mobile-actions";
import ReaderNavigationButton from "./navigation-button";
import { useGetBookUrl, useReaderView } from "./utils";
import VersionSelector from "./version-selector";
import ViewTabs from "./view-tabs";
import { useMobileReaderStore } from "@/stores/mobile-reader";
import { useMediaQuery } from "usehooks-ts";

const getPdfUrl = (bookResponse: ApiBookResponse) => {
  if (bookResponse.content.source === "pdf") {
    return bookResponse.content.url;
  }

  if ("pdfUrl" in bookResponse.content) {
    return bookResponse.content.pdfUrl;
  }

  return undefined;
};

export default function ReaderNavigation({
  isSinglePage,
}: {
  isSinglePage?: boolean;
}) {
  const { bookResponse } = useBookDetails();
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const bookSlug = bookResponse.book.slug;
  const t = useTranslations("reader");
  const bookUrl = useGetBookUrl(isSinglePage ? undefined : 1);
  const { activeTabId, setActiveTabId } = useMobileReaderStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const versionId = bookResponse.content.id;
  const pdf = getPdfUrl(bookResponse);

  const { hasEbook } = useReaderView();

  const isDrawerOpen = !!activeTabId && isMobile;

  return (
    <>
      <div
        className={cn(
          "bg-reader relative w-full px-5 transition will-change-transform lg:px-8",
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0",
        )}
      >
        <Container className="border-border flex items-center justify-between border-b px-0 py-2.5 2xl:max-w-5xl">
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
            <ViewTabs />
          </div>

          <div className="hidden flex-1 items-center gap-2 md:flex md:justify-end">
            <DownloadButton pdf={pdf} slug={bookSlug} />

            {!hasEbook ? (
              <ReaderNavigationButton disabled>
                <SinglePageIcon />
              </ReaderNavigationButton>
            ) : (
              <Link href={bookUrl}>
                <ReaderNavigationButton
                  tooltip={t(isSinglePage ? "all-pages" : "single-page")}
                  tooltipProps={{ side: "bottom" }}
                >
                  <SinglePageIcon />
                </ReaderNavigationButton>
              </Link>
            )}
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

            <Drawer open={isDrawerOpen} onClose={() => setActiveTabId(null)}>
              <DrawerContent>
                <DrawerTitle className="sr-only">Reader Navigation</DrawerTitle>
                <DrawerDescription className="sr-only">
                  You can use navigation, search, and AI to find what you need.
                </DrawerDescription>

                <div className="h-[90dvh] w-full overflow-y-auto">
                  {isDrawerOpen && (
                    <TabContent
                      tabId={activeTabId}
                      bookSlug={bookSlug}
                      versionId={versionId}
                      isSinglePage={isSinglePage}
                    />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </Container>
      </div>

      <div className="relative">
        <BookInfoHeader />
      </div>
    </>
  );
}
