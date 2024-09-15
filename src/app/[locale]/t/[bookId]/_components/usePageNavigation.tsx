import type { TabProps } from "./sidebar/tabs";

export const usePageNavigation = (bookResponse: TabProps["bookResponse"]) => {
  if (bookResponse.source === "external") {
    return {
      pagesRange: {
        start: 0,
        end: 0,
      },
      pageToIndex: null,
      getVirtuosoIndex: () => ({
        index: 0,
        align: "center" as const,
      }),
    };
  }

  const firstPage =
    (bookResponse.source === "turath"
      ? bookResponse.turathResponse.pages?.[0]?.page
      : bookResponse.content[0]?.page) ?? 0;
  const lastPage =
    (bookResponse.source === "turath"
      ? bookResponse.turathResponse.pages?.[
          bookResponse.turathResponse.pages.length - 1
        ]?.page
      : bookResponse.chapters[bookResponse.chapters.length - 1]?.page) ?? 0;

  const pagesRange = {
    start: typeof firstPage === "number" ? firstPage : 0,
    end: typeof lastPage === "number" ? lastPage : 0,
  };
  const pageToIndex =
    bookResponse.source === "turath"
      ? bookResponse.pageNumberWithVolumeToIndex
      : null;

  const getVirtuosoIndex = (
    page:
      | number
      | {
          vol: string;
          page: number;
        },
  ) => {
    let index =
      (typeof page === "number" ? page : page.page) - pagesRange.start;
    if (pageToIndex && typeof page === "object") {
      index = pageToIndex[`${page.vol}-${page.page}`] ?? index;
    }

    return {
      index,
      align: "center" as const,
    };
  };

  return {
    pagesRange,
    pageToIndex,
    getVirtuosoIndex,
  };
};

export type UsePageNavigationReturnType = ReturnType<typeof usePageNavigation>;
