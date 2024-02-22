import {
  type TypedBlock,
  type Block,
  parseMarkdown,
} from "@openiti/markdown-parser";
import { cache } from "react";

export const fetchBook = cache(async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/OpenITI/RELEASE/2385733573ab800b5aea09bc846b1d864f475476/data/0728IbnTaymiyya/0728IbnTaymiyya.Tawba/0728IbnTaymiyya.Tawba.JK000903-ara1",
  );
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

  return pages;
});
