/* eslint-disable react/jsx-key */
import { Separator } from "@/components/ui/separator";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/container";
import { useBookDetails } from "../../_contexts/book-details.context";
import { useReaderScroller } from "../context";
import { formatDeathYear } from "@/lib/date";
import { usePathLocale } from "@/lib/locale/utils";

export default function BookInfoHeader() {
  const { bookResponse } = useBookDetails();
  const [isVisible, setIsVisible] = useState(false);
  const readerScroller = useReaderScroller();
  const pathLocale = usePathLocale();

  useEffect(() => {
    if (!readerScroller?.element) return;
    const containerEl = readerScroller.element;
    const handleScroll = () => {
      console.log(containerEl.scrollTop);

      setIsVisible(containerEl.scrollTop > 500);
    };

    containerEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => containerEl.removeEventListener("scroll", handleScroll);
  }, [readerScroller?.element]);

  const book = bookResponse.book;

  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-[2] w-full bg-reader px-5 transition will-change-transform lg:px-8",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <Container className="relative flex items-center justify-between border-b border-border px-0 py-5 2xl:max-w-5xl">
        <div className="flex w-full justify-between">
          <div
            className={cn(
              "flex items-center gap-3 text-base font-semibold",
              book.secondaryName && "md:flex-1",
            )}
          >
            {[
              <p className="line-clamp-1">{book.primaryName}</p>,
              <bdi className="line-clamp-1">
                <Link
                  href={navigation.authors.bySlug(book.author.slug)}
                  className="text-primary underline underline-offset-4"
                  prefetch
                >
                  {book.author.primaryName}{" "}
                  {formatDeathYear(book.author.year, pathLocale)}
                </Link>
              </bdi>,
            ].map((item, index, arr) => (
              <Fragment key={index}>
                {item}
                {index < arr.length - 1 && (
                  <Separator orientation="vertical" className="h-6" />
                )}
              </Fragment>
            ))}
          </div>

          {book.secondaryName && (
            <div className="hidden items-center justify-end gap-3 text-base font-semibold md:flex md:flex-1">
              {[
                <bdi className="line-clamp-1">
                  <Link
                    href={navigation.authors.bySlug(book.author.slug)}
                    className="text-primary underline underline-offset-4"
                    prefetch
                  >
                    {book.author.secondaryName}{" "}
                    {formatDeathYear(book.author.year, "ar")}
                  </Link>
                </bdi>,
                <p className="line-clamp-1">{book.secondaryName}</p>,
              ].map((item, index, arr) => (
                <Fragment key={index}>
                  {item}
                  {index < arr.length - 1 && (
                    <Separator orientation="vertical" className="h-6" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
