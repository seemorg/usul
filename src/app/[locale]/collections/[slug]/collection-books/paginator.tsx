import { Fragment, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFormatter } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

export const usePage = () => {
  return useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true,
    }),
  );
};

export const Paginator = ({
  totalPages,
  currentPage,
  showNextAndPrevious = true,
}: {
  totalPages: number;
  currentPage: number;
  showNextAndPrevious?: boolean;
}) => {
  const formatter = useFormatter();
  const [page, setPage] = usePage();

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pages = useMemo(() => {
    const range = 2;
    const rangeStart = Math.max(1, currentPage - range);
    const rangeEnd = Math.min(totalPages, currentPage + range);

    const pagesArr: Array<number | null> = Array.from(
      { length: rangeEnd - rangeStart + 1 },
      (_, i) => rangeStart + i,
    );

    if (rangeStart > 1) {
      pagesArr.unshift(null);
    }

    if (rangeEnd < totalPages) {
      pagesArr.push(null);
    }

    return pagesArr;
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevious && showNextAndPrevious && (
          <PaginationPrevious
            asElement="button"
            onClick={() => setPage(page - 1)}
          />
        )}

        {pages.map((page, index) => {
          if (page === null) {
            if (index === 0) {
              return (
                <Fragment key={index}>
                  <PaginationItem>
                    <PaginationLink
                      asElement="button"
                      onClick={() => setPage(1)}
                      isActive={1 === currentPage}
                    >
                      {formatter.number(1)}
                    </PaginationLink>
                  </PaginationItem>{" "}
                  <PaginationEllipsis />
                </Fragment>
              );
            }

            return (
              <Fragment key={index}>
                <PaginationEllipsis />{" "}
                <PaginationItem>
                  <PaginationLink
                    asElement="button"
                    onClick={() => setPage(totalPages)}
                    isActive={totalPages === currentPage}
                  >
                    {formatter.number(totalPages)}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            );
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                asElement="button"
                onClick={() => setPage(page)}
                isActive={page === currentPage}
              >
                {formatter.number(page)}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {hasNext && showNextAndPrevious && (
          <PaginationNext
            asElement="button"
            onClick={() => setPage(currentPage + 1)}
          />
        )}
      </PaginationContent>
    </Pagination>
  );
};
