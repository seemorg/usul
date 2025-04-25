import { navigation } from "@/lib/urls";
import { usePathname, useRouter } from "@/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useBookDetails } from "../../_contexts/book-details.context";

export const useReaderView = () => {
  const pathname = usePathname();
  const { bookId: bookSlug, pageNumber } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { bookResponse } = useBookDetails();

  const defaultView =
    bookResponse.content.source === "pdf" && !bookResponse.content.pages
      ? "pdf"
      : "ebook";

  const getView = () => {
    const _view = searchParams.get("view") as string;

    if (defaultView === "pdf") {
      return "pdf";
    }

    // if the view is not valid, set it to the default view
    if (_view !== "pdf" && _view !== "ebook") {
      return defaultView;
    }

    return _view;
  };

  const view = getView();

  const setView = (newView: "pdf" | "ebook") => {
    if (newView === view) return;

    const newParams = new URLSearchParams(searchParams);
    if (newView === "ebook") {
      newParams.delete("view");
    } else {
      newParams.set("view", "pdf");
    }

    if (pageNumber) {
      router.push(
        `${navigation.books.reader(bookSlug as string)}?${newParams.toString()}`,
      );
    } else {
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  };

  return {
    view,
    setView,
    hasEbook: defaultView === "ebook",
    hasPdf:
      bookResponse.content.source === "pdf" || "pdfUrl" in bookResponse.content,
  };
};

export const useGetBookUrl = (pageNumber?: number) => {
  const bookSlug = useParams().bookId as string;
  const searchParams = useSearchParams();

  const baseUrl = pageNumber
    ? navigation.books.pageReader(bookSlug, pageNumber)
    : navigation.books.reader(bookSlug);

  const versionId = searchParams.get("versionId");

  if (versionId) {
    return `${baseUrl}?versionId=${versionId}`;
  }

  return baseUrl;
};
