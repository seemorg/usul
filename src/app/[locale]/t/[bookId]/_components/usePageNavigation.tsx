import type { TabProps } from "./sidebar/tabs";

export const usePageNavigation = (bookResponse: TabProps["bookResponse"]) => {
  const source = bookResponse.content.source;

  if (source === "external") {
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

  const firstPage = bookResponse.content.pages[0]?.page ?? 0;
  const lastPage =
    bookResponse.content.pages?.[bookResponse.content.pages.length - 1]?.page ??
    0;

  const pagesRange = {
    start: typeof firstPage === "number" ? firstPage : 0,
    end: typeof lastPage === "number" ? lastPage : 0,
  };
  const pageToIndex =
    source === "turath"
      ? bookResponse.content.pageNumberWithVolumeToIndex
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
