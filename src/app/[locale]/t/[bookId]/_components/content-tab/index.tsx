"use client";

import type { TabProps } from "../sidebar/tabs";
import { useBookDetails } from "../../_contexts/book-details.context";
import { useReaderView } from "../reader-navigation/utils";
import SidebarContainer from "../sidebar/sidebar-container";
import { usePageNavigation } from "../usePageNavigation";
import ChaptersList from "./chapters-section";
import PageNavigator from "./page-navigator";
import PdfChaptersList from "./pdf-chapters-section";

function ContentTab({ isSinglePage }: TabProps) {
  const { bookResponse } = useBookDetails();
  const { pagesRange, getVirtuosoScrollProps } = usePageNavigation();
  const { view } = useReaderView();
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
