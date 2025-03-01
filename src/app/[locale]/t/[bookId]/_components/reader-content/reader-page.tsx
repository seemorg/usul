"use client";

import RenderBlock from "@/components/render-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { getBook } from "@/lib/api";
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { PdfContent } from "@/types/api/content/pdf";
import type { TurathContent } from "@/types/api/content/turath";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { type PropsWithChildren, useMemo } from "react";

type DefaultPages = NonNullable<
  | TurathContent["pages"]
  | OpenitiContent["pages"]
  | NonNullable<PdfContent["pages"]>
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
  source,
}: {
  index: number;
  perPage?: number;
  defaultPages: DefaultPages;
  source: "turath" | "openiti" | "pdf";
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

  if (source === "turath") {
    const typedPage = page as TurathContent["pages"][number];
    let text = typedPage.text
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
          {typedPage.page
            ? `${typedPage.vol} / ${typedPage.page}`
            : t("pagination.page-unknown")}
        </PageLabel>
      </>
    );
  }

  if (source === "pdf") {
    const typedPage = page as NonNullable<PdfContent["pages"]>[number];
    let text = (typedPage.content ?? "-")
      .split("<br>")
      .map((block) => {
        return `<div class="block">${block}</div>`;
      })
      .join("");

    if (typedPage.footnotes) {
      text += `<p class="footnotes">${typedPage.footnotes}</p>`;
    }

    // TODO: show editorial notes

    return (
      <>
        <div
          className="reader-page"
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />

        <PageLabel>
          {typedPage.page
            ? typedPage.volume
              ? `${typedPage.volume} / ${typedPage.page}`
              : typedPage.page
            : t("pagination.page-unknown")}
        </PageLabel>
      </>
    );
  }

  if (source === "openiti") {
    const typedPage = page as OpenitiContent["pages"][number];

    return (
      <div className="reader-page">
        {typedPage.blocks.map((block, blockIndex) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <RenderBlock key={blockIndex} block={block as any} />
        ))}

        <PageLabel>
          {typedPage.page && !isNaN(typedPage.page)
            ? t("pagination.page-x", { page: typedPage.page })
            : t("pagination.page-unknown")}
        </PageLabel>
      </div>
    );
  }
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
