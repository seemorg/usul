import { useBookDetails } from "../_contexts/book-details.context";

export const usePageNavigation = () => {
  const { bookResponse } = useBookDetails();
  const source = bookResponse.content.source;

  if (
    source === "external" ||
    (source === "pdf" && !bookResponse.content.pages)
  ) {
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

  const total = bookResponse.pagination.total;

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
