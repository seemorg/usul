import RenderBlock from "@/components/render-markdown";
import { fetchBook } from "@/lib/book";
import { notFound } from "next/navigation";

export default async function ReaderPage({
  params: { bookId },
}: {
  params: {
    bookId: string;
  };
}) {
  let pages: Awaited<ReturnType<typeof fetchBook>>["pages"] = [];
  try {
    pages = (await fetchBook(bookId)).pages;
  } catch (e) {
    notFound();
  }

  return (
    <div
      className="flex min-h-screen flex-col divide-y-2 divide-gray-200 bg-white text-xl text-black"
      dir="rtl"
    >
      {pages.map((page, pageIdx) => {
        return (
          <div key={pageIdx} className="flex flex-col gap-5 rounded pb-5 pt-14">
            {page.blocks.map((block, blockIndex) => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <RenderBlock key={blockIndex} block={block as any} />
            ))}

            <p className="mt-10 text-center text-sm text-gray-400">
              {page.page?.page ? `page ${page.page.page}` : "unknown page"}
            </p>
          </div>
        );
      })}
    </div>
  );
}