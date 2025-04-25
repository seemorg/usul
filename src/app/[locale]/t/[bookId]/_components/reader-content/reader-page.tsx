"use client";

import RenderBlock from "@/components/render-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import type { OpenitiContent } from "@/types/api/content/openiti";
import type { PdfContent } from "@/types/api/content/pdf";
import type { TurathContent } from "@/types/api/content/turath";
import { useTranslations } from "next-intl";
import type {PropsWithChildren} from "react";
import useFetchPage from "./use-fetch-page";
import type {DefaultPages} from "./use-fetch-page";

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
    const text = typedPage.text
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
