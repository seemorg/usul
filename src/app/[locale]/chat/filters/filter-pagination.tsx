import type { Pagination as PaginationType } from "@/types/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function FilterPagination({
  pagination,
  currentPage,
  setCurrentPage,
}: {
  pagination?: PaginationType;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const hasNextPage = pagination?.hasNext ?? false;
  const hasPrevPage = pagination?.hasPrev ?? false;
  const totalPages = pagination?.totalPages ?? 0;

  if (totalPages <= 1) return null;

  return (
    <div className="border-t p-2">
      <Pagination>
        <PaginationContent>
          {hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious
                asElement="button"
                onClick={() => setCurrentPage(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show current page, first page, last page, and pages around current
              const range = 1;
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - range && page <= currentPage + range)
              );
            })
            .map((page, index, array) => {
              // Add ellipsis if there's a gap
              const prevPage = array[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <div key={page} className="flex items-center">
                  {showEllipsis && (
                    <span className="text-muted-foreground px-2">...</span>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      asElement="button"
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </div>
              );
            })}

          {hasNextPage && (
            <PaginationItem>
              <PaginationNext
                asElement="button"
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
