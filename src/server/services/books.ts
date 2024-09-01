"use server";

import { type Block, parseMarkdown } from "@openiti/markdown-parser";
import { cache } from "react";
import slugify from "slugify";
import { db } from "@/server/db";
import { log } from "next-axiom";
import type { PathLocale } from "@/lib/locale/utils";
import { getLocaleWhereClause } from "../db/localization";
import type { TurathBookResponse } from "@/types/turath/book";

const bookKeysMap = `
meta id name type printed pdf_links info info_long version \
author_id cat_id date_built author_page_start indexes volumes \
headings print_pg_to_pg volume_bounds page_map page_headings non_author
`
  .trim()
  .split(" ");

const unObfuscateKeys = (s: string) =>
  s.replace(
    /"([ً-ٟ])":/g,
    (m, m1) => `"${bookKeysMap[m1.charCodeAt(0) - 0x064b]}":`,
  );

const getTurathBookById = async (id: number | string) => {
  const text = await (
    await fetch(`https://files.turath.io/books-v3/${id}.json`, {
      cache: "no-store",
    })
  ).text();
  return JSON.parse(unObfuscateKeys(text)) as TurathBookResponse;
};

const getOpenitiBook = async ({
  authorId,
  bookId,
  versionId,
}: {
  authorId: string;
  bookId: string;
  versionId: string;
}) => {
  const baseUrl = `https://raw.githubusercontent.com/OpenITI/RELEASE/2385733573ab800b5aea09bc846b1d864f475476/data/${authorId}/${bookId}/${versionId}`;
  const options: RequestInit = {
    cache: "no-store",
  };
  let response = await fetch(baseUrl, options);

  if (!response.ok || response.status >= 300) {
    response = await fetch(`${baseUrl}.completed`, options);

    if (!response.ok || response.status >= 300) {
      response = await fetch(`${baseUrl}.mARkdown`, options);

      if (!response.ok || response.status >= 300) {
        throw new Error("Book not found");
      }
    }
  }

  const text = await response.text();
  const final = parseMarkdown(text);

  return final;
};

export const fetchBook = cache(
  async (id: string, locale: PathLocale = "en", versionId?: string) => {
    const localeWhere = getLocaleWhereClause(locale);

    const record = await db.book.findFirst({
      where: {
        slug: id,
      },
      include: {
        author: {
          include: {
            primaryNameTranslations: localeWhere,
            otherNameTranslations: localeWhere,
            bioTranslations: localeWhere,
          },
        },
        genres: true,
        primaryNameTranslations: localeWhere,
        otherNameTranslations: localeWhere,
      },
    });

    if (!record) {
      throw new Error("Book not found");
    }

    const allVersions = record.versions;
    const version = versionId
      ? allVersions.find((v) => v.value === versionId)
      : record.versions[0];

    if (!version) {
      throw new Error("Book not found");
    }

    if (version.source === "turath") {
      const res = await getTurathBookById(version.value);

      const pageNumberToRealNumber = Object.entries(
        res.indexes.print_pg_to_pg,
      ).reduce(
        (acc, curr) => {
          const [realPage, page] = curr;
          const v = Number(realPage.split(",")[1]);

          if (!v || !page) return acc;

          acc[page] = v;

          return acc;
        },
        {} as Record<number, number>,
      ) as Record<number, number>;

      let lastPage: number;
      res.indexes.headings = res.indexes.headings.map((h) => {
        let page = pageNumberToRealNumber[h.page];

        if (page) lastPage = page;
        else page = lastPage;

        return {
          ...h,
          page,
        };
      });

      const mergedPages: TurathBookResponse["pages"] = [];
      const oldIndexToNewIndex: Record<number, number> = {};
      const pageNumberToIndex: Record<number, number> = {};
      for (let i = 0; i < res.pages.length; i++) {
        const page = res.pages[i]!;
        // const realPage = pageNumberToRealNumber[page.page];

        let didMerge = false;
        if (mergedPages.length > 0) {
          const lastPage = mergedPages[mergedPages.length - 1]!;
          if (lastPage.page === page.page && lastPage.vol === page.vol) {
            lastPage.text += lastPage.text.endsWith("</span>.")
              ? page.text
              : `<br>${page.text}`;
            didMerge = true;
          }
        }

        if (!didMerge) {
          mergedPages.push(page);
        }

        oldIndexToNewIndex[i] = mergedPages.length - 1;
        pageNumberToIndex[page.page] = mergedPages.length - 1;
      }

      const chapterIndexToPageIndex: Record<number, number> = {};
      Object.entries(res.indexes.page_headings).forEach((curr) => {
        const [pageIndex, headingIndices] = curr;
        headingIndices.forEach((i) => {
          chapterIndexToPageIndex[i - 1] =
            oldIndexToNewIndex[Number(pageIndex) - 1] ?? -1;
        });
      });

      // fetch from turath
      return {
        turathResponse: {
          ...res,
          pages: mergedPages,
        },
        chapterIndexToPageIndex,
        pageNumberToIndex,
        book: record,
      };
    }

    try {
      const final = await getOpenitiBook({
        authorId: record.author.id,
        bookId: record.id,
        versionId: version.value,
      });

      const headerSlugs = new Set<string>();
      // an array of headings (1-3) to be used as a table of contents
      const headers: {
        id: string; // a unique id for the header so we can link to it
        content: string;
        page: { volume: string | number; page: string | number } | null;
      }[] = [];

      // final is an array that contains the content of the book in the following format:
      // [text, text, pageNumber, text, text, pageNumber, ...]
      // we need to split the content into pages by the pageNumber blocks
      const pages: {
        page: { volume: string | number; page: string | number } | null;
        blocks: Block[];
      }[] = [];
      let currentPage: Block[] = [];
      let currentHeaders: typeof headers = [];

      for (let i = 0; i < final.content.length; i++) {
        const block = final.content[i]!;

        if (block.type === "pageNumber") {
          const stringVolume = block.content.volume;
          const stringPage = block.content.page;

          const numberVolume = Number(stringVolume);
          const numberPage = Number(stringPage);

          const volume = isNaN(numberVolume) ? stringVolume : numberVolume;
          const page = isNaN(numberPage) ? stringPage : numberPage;

          pages.push({
            page: {
              volume,
              page,
            },
            blocks: [...currentPage],
          });
          headers.push(
            ...currentHeaders.map((h) => ({ ...h, page: { volume, page } })),
          );

          currentPage = [];
          currentHeaders = [];
        } else {
          currentPage.push(block);

          if (
            block.type === "header-1" ||
            block.type === "header-2" ||
            block.type === "header-3" ||
            block.type === "title"
          ) {
            const id = generateHeaderId(block.content, headerSlugs);
            headerSlugs.add(id);
            currentHeaders.push({
              id,
              content: block.content,
              page: null,
            });
          }
        }
      }

      // add the last page
      if (currentPage.length > 0) {
        pages.push({ page: null, blocks: [...currentPage] });
      }

      if (currentHeaders.length > 0) {
        headers.push(...currentHeaders);
      }

      return { pages, book: record, headers };
    } catch (e) {
      log.error("book_not_found", { slug: id, versionId });
      await log.flush();

      throw e;
    }
  },
);

function generateHeaderId(content: string, prevSlugs: Set<string>) {
  const id = slugify(content, { lower: true });

  if (!prevSlugs.has(id)) {
    return id;
  }

  let i = 1;
  while (prevSlugs.has(`${id}-${i}`)) {
    i++;
  }

  return `${id}-${i}`;
}

export const countAllBooks = cache(async () => {
  return await db.book.count();
});

export const getPopularBooks = cache(async () => {
  const result = await db.book.findMany({
    take: 10,
  });

  return result;
});
