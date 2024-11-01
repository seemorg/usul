import { navigation } from "@/lib/urls";
import { usePathname, useRouter } from "@/navigation";
import { useParams, useSearchParams } from "next/navigation";

export const useReaderView = () => {
  const pathname = usePathname();
  const { bookId: bookSlug, pageNumber } = useParams();
  const searchParams = useSearchParams();

  const _view = searchParams.get("view") as string;
  const view = _view !== "pdf" && _view !== "ebook" ? "ebook" : _view;

  const router = useRouter();

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

  return { view, setView };
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
