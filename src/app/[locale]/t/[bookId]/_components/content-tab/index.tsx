"use client";

import { Separator } from "@/components/ui/separator";
import SidebarContainer from "../sidebar/sidebar-container";
import PageNavigator from "./page-navigator";
import ChaptersList from "./chapters-section";
import type { TabProps } from "../sidebar/tabs";
import { usePageNavigation } from "../usePageNavigation";
import { useSearchParams } from "next/navigation";
import PdfChaptersList from "./pdf-chapters-section";

function ContentTab({ bookResponse }: TabProps) {
  const { pagesRange, getVirtuosoIndex } = usePageNavigation(bookResponse);

  const view = (useSearchParams().get("view") ?? "default") as
    | "pdf"
    | "default";

  const bookContent = bookResponse.content;

  const isExternal = bookContent.source === "external";

  const headings = !isExternal ? bookContent.headings : [];

  const chapterIndexToPageIndex =
    bookContent.source === "turath"
      ? bookContent.chapterIndexToPageIndex
      : null;

  if (isExternal) return null;

  let content;
  if (view === "pdf") {
    content = <PdfChaptersList />;
  } else {
    content = (
      <>
        {headings && headings.length > 0 ? (
          <SidebarContainer>
            <div className="w-full">
              <PageNavigator
                range={pagesRange}
                getVirtuosoIndex={getVirtuosoIndex}
              />
            </div>
          </SidebarContainer>
        ) : null}

        <ChaptersList
          headers={headings || []}
          getVirtuosoIndex={getVirtuosoIndex}
          chapterIndexToPageIndex={chapterIndexToPageIndex}
          pagesRange={pagesRange}
        />
      </>
    );
  }

  return (
    <>
      <Separator className="my-4" />
      {content}
      <div className="h-16" />
    </>
  );
}

export default ContentTab;
