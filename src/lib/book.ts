import {
  type TypedBlock,
  type Block,
  parseMarkdown,
} from "@openiti/markdown-parser";
import { cache } from "react";
import { db } from "@/server/db";

export const fetchBook = cache(async (id: string, versionId?: string) => {
  const record = await db.query.book.findFirst({
    where: (book, { eq }) => eq(book.id, id.replaceAll("-", ".")),
    with: {
      author: true,
    },
  });

  if (!record || (versionId && !record.versionIds.includes(versionId))) {
    throw new Error("Book not found");
  }

  const version = versionId ?? record.versionIds[0];
  if (!version) {
    return { pages: [], book: record };
  }

  const response = await fetch(
    `https://raw.githubusercontent.com/OpenITI/RELEASE/2385733573ab800b5aea09bc846b1d864f475476/data/${record.author.id}/${record.id}/${version}`,
  );

  if (!response.ok || response.status >= 300) {
    throw new Error("Book not found");
  }

  const text = await response.text();

  const final = parseMarkdown(text);

  // final is an array that contains the content of the book in the following format:
  // [text, text, pageNumber, text, text, pageNumber, ...]
  // we need to split the content into pages by the pageNumber blocks
  const pages: {
    page: TypedBlock<"pageNumber">["content"] | null;
    blocks: Block[];
  }[] = [];
  let currentPage: Block[] = [];

  for (let i = 0; i < final.content.length; i++) {
    const block = final.content[i]!;

    if (block.type === "pageNumber") {
      pages.push({ page: block.content, blocks: [...currentPage] });
      currentPage = [];
    } else {
      currentPage.push(block);
    }
  }

  // add the last page
  if (currentPage.length > 0) {
    pages.push({ page: null, blocks: [...currentPage] });
  }

  return { pages, book: record };
});
