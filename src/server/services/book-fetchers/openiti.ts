import { parser } from "@openiti/markdown-parser";
import slugify from "slugify";

// function generateHeaderId(content: string, prevSlugs: Set<string>) {
//   const id = slugify(content, { lower: true });

//   if (!prevSlugs.has(id)) {
//     return id;
//   }

//   let i = 1;
//   while (prevSlugs.has(`${id}-${i}`)) {
//     i++;
//   }

//   return `${id}-${i}`;
// }

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
  const final = parser(text);

  // const headerSlugs = new Set<string>();

  // an array of headings (1-3) to be used as a table of contents
  const headers: {
    content: string;
    page: { volume: string | number; page: string | number } | null;
  }[] = [];

  for (let i = 0; i < final.pages.length; i++) {
    const page = final.pages[i]!;

    // replace @QB and @QE with "
    page.text = page.text.replace(/@QB@|@QE@/g, '"');

    if (page.chapterHeadings) {
      page.chapterHeadings.forEach((heading) => {
        headers.push({
          content: heading.replace(/@QB@|@QE@/g, '"'),
          page: { page: page.page, volume: page.volume },
        });
      });
    }
  }

  return { pages: final.pages, headers, metadata: final.metadata };
};
