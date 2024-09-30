import type { TabProps } from "./sidebar/tabs";

export const usePageNavigation = (bookResponse: TabProps["bookResponse"]) => {
  const source = bookResponse.content.source;
  const total = bookResponse.pagination.total;

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

  const firstPage = 1;
  const lastPage = total;

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
    let index: number | undefined;

    if (pageToIndex && typeof page === "object") {
      const newIdx = pageToIndex[`${page.vol}-${page.page}`];
      if (newIdx) {
        index = newIdx;
      }
    }

    if (index === undefined) {
      index = (typeof page === "number" ? page : page.page) - pagesRange.start;
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
