"use client";

import { Separator } from "@/components/ui/separator";
import SidebarContainer from "../sidebar/sidebar-container";
import PageNavigator from "./page-navigator";
import ChaptersList from "./chapters-section";
import type { TabProps } from "../sidebar/tabs";
import { usePageNavigation } from "../usePageNavigation";
import { useSearchParams } from "next/navigation";
import PdfChaptersList from "./pdf-chapters-section";

function ContentTab({ bookResponse, isSinglePage }: TabProps) {
  const { pagesRange, getVirtuosoScrollProps } =
    usePageNavigation(bookResponse);

  const view = (useSearchParams().get("view") ?? "default") as
    | "pdf"
    | "default";

  const bookContent = bookResponse.content;

  const isExternal = bookContent.source === "external";

  const headings = !isExternal ? bookContent.headings : [];

  if (isExternal) return null;

  let content;
  if (view === "pdf") {
    content = <PdfChaptersList />;
  } else {
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
      <Separator className="my-4" />
      {content}
      <div className="h-16" />
    </>
  );
}

export default ContentTab;
