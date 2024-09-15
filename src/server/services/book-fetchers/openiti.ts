import { parseMarkdown } from "@openiti/markdown-parser";

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
  let finalUrl = baseUrl;

  const options: RequestInit = {
    cache: "no-store",
  };
  let response = await fetch(baseUrl, options);

  if (!response.ok || response.status >= 300) {
    finalUrl = `${baseUrl}.completed`;
    response = await fetch(finalUrl, options);

    if (!response.ok || response.status >= 300) {
      finalUrl = `${baseUrl}.mARkdown`;
      response = await fetch(finalUrl, options);

      if (!response.ok || response.status >= 300) {
        throw new Error("Book not found");
      }
    }
  }

  const text = await response.text();
  const final = parseMarkdown(text);

  // filter out empty blocks
  final.content = final.content.filter((a) => a.blocks.length > 0);

  return {
    ...final,
    rawUrl: finalUrl,
  };
};
