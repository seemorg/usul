import { type Block, parseMarkdown } from "@openiti/markdown-parser";
import slugify from "slugify";

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

export const fetchOpenitiBook = async ({
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

  return { pages, headers };
};
