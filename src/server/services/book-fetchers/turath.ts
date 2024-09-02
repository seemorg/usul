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

export const fetchTurathBook = async (id: string) => {
  const res = await getTurathBookById(id);

  const headerPageToVolumeAndPage = Object.entries(
    res.indexes.print_pg_to_pg,
  ).reduce(
    (acc, curr) => {
      const [bookPage, headerPage] = curr;
      const [vol, page] = bookPage.split(",");

      if (!vol || !page) return acc;

      acc[headerPage] = { vol, page: Number(page) };

      return acc;
    },
    {} as Record<number, { vol: string; page: number }>,
  );

  let lastPage: number;
  const headings = res.indexes.headings.map((h) => {
    const headerPage = h.page;

    // try to directly get the page from the headerPageToVolumeAndPage
    let page = headerPageToVolumeAndPage[headerPage];

    // if not found, iterate backwards and find the first that's smaller than the current headerPage
    if (!page) {
      if (lastPage && headerPage > lastPage) {
        // Use the last known page if the current header page is greater
        page = headerPageToVolumeAndPage[lastPage];
      } else {
        // Iterate backwards to find the closest previous page
        for (let i = headerPage - 1; i > 0; i--) {
          page = headerPageToVolumeAndPage[i];
          if (page) {
            lastPage = i;
            break;
          }
        }
      }
    } else {
      lastPage = headerPage;
    }

    return {
      ...h,
      page,
    };
  });

  const mergedPages: TurathBookResponse["pages"] = [];
  const oldIndexToNewIndex: Record<number, number> = {};
  const pageNumberWithVolumeToIndex: Record<string, number> = {};

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
    pageNumberWithVolumeToIndex[`${page.vol}-${page.page}`] =
      mergedPages.length - 1;
  }

  const chapterIndexToPageIndex: Record<number, number> = {};
  Object.entries(res.indexes.page_headings).forEach((curr) => {
    const [pageIndex, headingIndices] = curr;
    headingIndices.forEach((i) => {
      chapterIndexToPageIndex[i - 1] =
        oldIndexToNewIndex[Number(pageIndex) - 1] ?? -1;
    });
  });

  const pdf = res.meta.pdf_links;

  // fetch from turath
  return {
    turathResponse: {
      pdf,
      headings,
      pages: mergedPages,
    },
    chapterIndexToPageIndex,
    pageNumberWithVolumeToIndex,
  };
};
