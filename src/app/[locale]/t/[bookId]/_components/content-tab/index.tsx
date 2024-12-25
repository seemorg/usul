"use client";

import SidebarContainer from "../sidebar/sidebar-container";
import PageNavigator from "./page-navigator";
import ChaptersList from "./chapters-section";
import type { TabProps } from "../sidebar/tabs";
import { usePageNavigation } from "../usePageNavigation";
import { useSearchParams } from "next/navigation";
import PdfChaptersList from "./pdf-chapters-section";
import { useBookDetails } from "../../_contexts/book-details.context";

function ContentTab({ isSinglePage }: TabProps) {
  const { bookResponse } = useBookDetails();
  const { pagesRange, getVirtuosoScrollProps } = usePageNavigation();

  const _view = (useSearchParams().get("view") ?? "default") as
    | "pdf"
    | "default";
  const view = bookResponse.content.source === "pdf" ? "pdf" : _view;

  const bookContent = bookResponse.content;

  const isExternal = bookContent.source === "external";
  if (isExternal) return null;

  let content;
  if (view === "pdf") {
    content = <PdfChaptersList />;
  } else {
    const headings = "headings" in bookContent ? bookContent.headings : [];

    content = (
      <>
        {headings && headings.length > 0 && !isSinglePage ? (
          <SidebarContainer>
            <div className="w-full">
              <PageNavigator
                range={pagesRange}
                getVirtuosoScrollProps={getVirtuosoScrollProps}
              />
            </div>
          </SidebarContainer>
        ) : null}

        <ChaptersList
          headers={headings || []}
          getVirtuosoScrollProps={getVirtuosoScrollProps}
          pagesRange={pagesRange}
          isSinglePage={isSinglePage}
        />
      </>
    );
  }

  return (
    <>
      {content}
      <div className="h-16" />
    </>
  );
}

export default ContentTab;
