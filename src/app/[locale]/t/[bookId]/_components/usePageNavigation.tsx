import type { TabProps } from "./sidebar/tabs";

export const usePageNavigation = (bookResponse: TabProps["bookResponse"]) => {
  const firstPage =
    (bookResponse.turathResponse
      ? bookResponse.turathResponse.pages?.[0]?.page
      : bookResponse.pages[0]?.page?.page) ?? 0;
  const lastPage =
    (bookResponse.turathResponse
      ? bookResponse.turathResponse.pages?.[
          bookResponse.turathResponse.pages.length - 1
        ]?.page
      : bookResponse.pages[bookResponse.pages.length - 1]?.page?.page) ?? 0;

  const pagesRange = {
    start: typeof firstPage === "number" ? firstPage : 0,
    end: typeof lastPage === "number" ? lastPage : 0,
  };
  const pageToIndex = bookResponse.pageToRenderIndex;

  return {
    pagesRange,
    pageToIndex,
  };
};
