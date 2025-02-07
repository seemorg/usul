"use client";

import RenderBlock from "@/components/render-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { getBook } from "@/lib/api";
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { TurathContent } from "@/types/api/content/turath";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { type PropsWithChildren, useMemo } from "react";

type DefaultPages = NonNullable<
  TurathContent["pages"] | OpenitiContent["pages"]
>;

const PageLabel = (props: PropsWithChildren) => (
  <p
    className="mt-10 text-center font-sans text-sm text-muted-foreground"
    {...props}
  />
);

const footnotesChar = "_________";

export default function ReaderPage({
  index,
  perPage = 10,
  defaultPages,
}: {
  index: number;
  perPage?: number;
  defaultPages: DefaultPages;
}) {
  const t = useTranslations("common");
  const { page, isLoading, isError } = useFetchPage(
    index,
    perPage,
    defaultPages,
  );

  if (isError) {
    return <div>Error loading page</div>;
  }

  if (!page || isLoading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  const isTurath = "text" in page;

  if (isTurath) {
    let text = page.text
      .replaceAll("</span>.", "</span>")
      .split(`<br>`)
      .map((block) => {
        let final = block;

        const footnotesIndex = block.indexOf(footnotesChar);
        if (footnotesIndex > -1) {
          const txt = block.slice(0, footnotesIndex);
          const footnotes = block.slice(footnotesIndex + footnotesChar.length);

          final = txt + `<p class="footnotes">${footnotes}</p>`;
        }

        return `<div class="block">${final}</div>`;
      });

    return (
      <>
        <div
          className="reader-page"
          dangerouslySetInnerHTML={{
            __html: text.join(""),
          }}
        />

        <PageLabel>
          {page.page
            ? `${page.vol} / ${page.page}`
            : t("pagination.page-unknown")}
        </PageLabel>
      </>
    );
  }

  /**
   * return No(t,
   * [
   * ["<br><span class=indent></span>","\n"],
   * ["<hr class=fnote-sep>","\n__________\n"],
   * [/<.*?>/g,""]
   * ])}()
   */

  /**
   * {const t=e.indexOf("_________");return t > -1 &&(e=e.slice(0,t)),((" "+e.replaceAll("\n"," ")).match(/."/g)||[]).reduce(((e,t,n)=>e+((n%2?" "!==t[0]:" "===t[0])?.1:-.1)),0)<0}(e=No(e,[[': " ',': "'],[' ".\n','".\n'],[' ". ','". '],[' ": " ','": "'],[/ و" /g,' و "']])
   */

  const { blocks, page: pageNumber } = page;

  return (
    <div className="reader-page">
      {blocks.map((block, blockIndex) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <RenderBlock key={blockIndex} block={block as any} />
      ))}

      <PageLabel>
        {pageNumber && !isNaN(pageNumber)
          ? t("pagination.page-x", { page: pageNumber })
          : t("pagination.page-unknown")}
      </PageLabel>
    </div>
  );
}

const useFetchPage = (
  index: number,
  perPage: number,
  defaultPages: DefaultPages,
) => {
  const params = useParams();
  const versionId = useSearchParams().get("versionId");
  const slug = params.bookId as string;

  const pageNumber = params.pageNumber as string | undefined;
  const isSinglePage = !!pageNumber;

  const pageInfo = useMemo(() => {
    const page = Math.floor(index / perPage);
    const startIndex = page * perPage;
    const relativeIndex = index - startIndex;

    return {
      page,
      startIndex,
      relativeIndex,
    };
  }, [index, perPage]);

  const shouldUseDefaultPages = pageInfo.startIndex < defaultPages.length;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reader", slug, versionId, pageInfo.startIndex] as const,
    queryFn: async ({ queryKey }) => {
      const [, _bookSlug, _versionId, startIndex] = queryKey;

      const response = await getBook(_bookSlug, {
        startIndex: startIndex,
        size: perPage,
        versionId: _versionId ?? undefined,
      });

      if (!response || "type" in response) {
        return null;
      }

      return (response.content as any).pages as DefaultPages;
    },
    enabled: !isSinglePage && !shouldUseDefaultPages,
  });

  const defaultPage = isSinglePage
    ? defaultPages[0]
    : shouldUseDefaultPages
      ? defaultPages[pageInfo.relativeIndex]
      : null;

  const page = data ? data[pageInfo.relativeIndex] : defaultPage;

  return {
    page,
    isLoading,
    isError,
  };
};
