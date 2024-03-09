import type { searchBooks } from "@/lib/search";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import Image from "next/image";

const BookSearchResult = ({
  result,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchBooks>>["results"]["hits"]
  >[number];
}) => {
  const { document } = result;

  const { primaryArabicName, primaryLatinName } = document;

  const title = primaryArabicName ?? primaryLatinName;

  return (
    <Link
      href={navigation.books.reader(document.slug)}
      prefetch={false}
      className="mx-auto block h-full w-4/5 md:w-full"
    >
      <div
        className={cn(
          "relative flex aspect-[160/256] w-full flex-col items-center justify-center gap-6 rounded-md bg-gray-200 p-8 text-gray-700",
        )}
      >
        {document.author.slug === "ghazali" ? (
          <Image
            src={`/covers/${document.author.slug}/${document.slug}.png`}
            alt={title}
            fill
            className="absolute inset-0 h-full w-full rounded-md object-cover"
            placeholder="empty"
          />
        ) : (
          <>
            <h3 className="text-center text-2xl font-semibold">
              {/* {primaryLatinName ?? primaryArabicName} */}
              {title.length > 50 ? `${title.slice(0, 50)}...` : title}
            </h3>

            <p>
              {document.author.primaryArabicName ??
                document.author.primaryLatinName}
            </p>
          </>
        )}
      </div>
      <div className="mt-2 text-right">
        <p className="mt-2 text-lg font-semibold">
          {primaryArabicName ?? primaryLatinName}
        </p>
        {primaryLatinName && primaryArabicName && (
          <p className="mt-2">{primaryLatinName}</p>
        )}
      </div>
    </Link>
  );
};

export default BookSearchResult;
