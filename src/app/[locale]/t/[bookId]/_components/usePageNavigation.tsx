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
      getVirtuosoScrollProps: () => ({
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

  const getVirtuosoScrollProps = (index: number) => {
    return {
      index,
      align: "center" as const,
    };
  };

  return {
    pagesRange,
    getVirtuosoScrollProps,
  };
};

export type UsePageNavigationReturnType = ReturnType<typeof usePageNavigation>;
