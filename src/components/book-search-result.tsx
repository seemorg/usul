import type { searchBooks } from "@/lib/search";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";

const BookSearchResult = ({
  result,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchBooks>>["results"]["hits"]
  >[number];
}) => {
  const { document } = result;

  const { primaryArabicName, primaryLatinName } = document;

  // if (!primaryArabicName && !primaryLatinName) {
  //   return null;
  // }

  // const authorPrimaryArabicName = highlight.author?.primaryArabicName?.snippet
  //   ? highlight.author.primaryArabicName.snippet
  //   : document.author.primaryArabicName;
  // const authorPrimaryLatinName = highlight.author?.primaryLatinName?.snippet
  //   ? highlight.author.primaryLatinName.snippet
  //   : document.author.primaryLatinName;

  // const authorGithubUrl = `https://github.com/OpenITI/RELEASE/tree/2385733573ab800b5aea09bc846b1d864f475476/data/${document.authorId}`;
  // const githubUrl = `${authorGithubUrl}/${document.id}`;

  // const tags = document.genreTags
  //   .map((g) => g.split("@")[1]?.trim())
  //   .filter((a) => !!a);

  // return (
  //   <SearchResultItem
  //     collapsedContent={
  //       <div className="flex items-center justify-between">
  //         <div className="flex-[1.5]">
  //           <a
  //             href={githubUrl}
  //             target="_blank"
  //             className="flex w-fit flex-col items-start hover:underline"
  //           >
  //             {primaryArabicName && (
  //               <h2
  //                 dir="rtl"
  //                 className="line-clamp-1 text-ellipsis text-xl text-slate-900"
  //                 dangerouslySetInnerHTML={{
  //                   __html: primaryArabicName,
  //                 }}
  //               />
  //             )}

  //             {primaryLatinName && (
  //               <h2
  //                 className={cn(
  //                   "line-clamp-1 text-ellipsis",
  //                   primaryArabicName
  //                     ? "mt-2 text-lg text-slate-600"
  //                     : "text-xl text-slate-900",
  //                 )}
  //                 dangerouslySetInnerHTML={{
  //                   __html: primaryLatinName,
  //                 }}
  //               />
  //             )}
  //           </a>
  //         </div>

  //         <div className="flex flex-1 justify-center">
  //           <a
  //             href={authorGithubUrl}
  //             target="_blank"
  //             className="flex w-fit flex-col items-center hover:underline"
  //           >
  //             {authorPrimaryArabicName && (
  //               <h2
  //                 dir="rtl"
  //                 className="line-clamp-1 text-ellipsis text-xl text-slate-900"
  //                 dangerouslySetInnerHTML={{
  //                   __html: authorPrimaryArabicName,
  //                 }}
  //               />
  //             )}

  //             {authorPrimaryLatinName && (
  //               <h2
  //                 className={cn(
  //                   "line-clamp-1 text-ellipsis",
  //                   document.author.primaryArabicName
  //                     ? "mt-2 text-lg text-slate-600"
  //                     : "text-xl text-slate-900",
  //                 )}
  //                 dangerouslySetInnerHTML={{
  //                   __html: authorPrimaryLatinName,
  //                 }}
  //               />
  //             )}
  //           </a>
  //         </div>

  //         <div className="hidden flex-1 text-center sm:block">
  //           {document.versionIds.length} Versions
  //         </div>

  //         {tags.length > 0 ? (
  //           <div className="hidden flex-1 text-center sm:block">
  //             {tags.slice(0, 3).join(", ")}
  //             {tags.length > 3 && <p>+{tags.length - 3} more</p>}
  //           </div>
  //         ) : (
  //           <div className="hidden flex-1 text-center sm:block">None</div>
  //         )}
  //       </div>
  //     }
  //     expandedContent={
  //       <>
  //         <div className="flex flex-col items-start justify-between gap-5 sm:flex-row-reverse sm:gap-0">
  //           <div className="max-w-lg flex-1 text-right">
  //             {primaryArabicName && (
  //               <h2
  //                 className="text-xl text-slate-900"
  //                 dangerouslySetInnerHTML={{
  //                   __html: primaryArabicName,
  //                 }}
  //               />
  //             )}
  //             <p className="text-slate-700">
  //               {document.otherArabicNames.join(", ")}
  //             </p>
  //           </div>

  //           <div className="max-w-lg flex-1 text-left">
  //             {primaryLatinName && (
  //               <h2
  //                 className="text-xl text-slate-900"
  //                 dangerouslySetInnerHTML={{
  //                   __html: primaryLatinName,
  //                 }}
  //               />
  //             )}

  //             <p className="text-slate-700">
  //               {document.otherLatinNames.join(", ")}
  //             </p>
  //           </div>
  //         </div>

  //         <div className="mt-10">
  //           <p className="text-xl font-bold">Author:</p>
  //           <div className="mt-3 flex flex-col items-start justify-between gap-5 sm:flex-row-reverse sm:gap-0">
  //             <div className="max-w-lg flex-1 text-right">
  //               {authorPrimaryArabicName && (
  //                 <h2
  //                   className="text-xl text-slate-900"
  //                   dangerouslySetInnerHTML={{
  //                     __html: authorPrimaryArabicName,
  //                   }}
  //                 />
  //               )}
  //               <p className="text-slate-700">
  //                 {document.author.otherArabicNames.join(", ")}
  //               </p>
  //             </div>

  //             <div className="max-w-lg flex-1 text-left">
  //               {authorPrimaryLatinName && (
  //                 <h2
  //                   className="text-xl text-slate-900"
  //                   dangerouslySetInnerHTML={{
  //                     __html: authorPrimaryLatinName,
  //                   }}
  //                 />
  //               )}

  //               <p className="text-slate-700">
  //                 {document.author.otherLatinNames.join(", ")}
  //               </p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="mt-10">
  //           <p className="text-xl font-bold">Versions:</p>
  //           <div className="mt-3 grid grid-cols-1 items-end gap-3 sm:grid-cols-2">
  //             {document.versionIds.map((version) => {
  //               const versionUrl = `${githubUrl}/${version}`;

  //               return (
  //                 <div key={version}>
  //                   <a
  //                     className="block w-fit text-primary hover:text-primary/80 hover:underline"
  //                     href={versionUrl}
  //                     target="_blank"
  //                   >
  //                     <p>{version}</p>
  //                   </a>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </div>

  //         <div className="mt-10">
  //           <p className="text-xl font-bold">Tags:</p>
  //           <div className="mt-3 flex max-w-xl flex-wrap gap-1">
  //             {tags.length ? (
  //               tags.map((tag) => {
  //                 return (
  //                   <div
  //                     key={tag}
  //                     className="rounded-full bg-primary px-3 py-1 text-xs text-white"
  //                   >
  //                     <p>{tag}</p>
  //                   </div>
  //                 );
  //               })
  //             ) : (
  //               <p>None</p>
  //             )}
  //           </div>
  //         </div>
  //       </>
  //     }
  //   />
  // );

  const title = primaryArabicName ?? primaryLatinName;

  // const allBgs = [
  //   "bg-primary-foreground",
  //   "bg-blue-200",
  //   "bg-green-200",
  //   "bg-yellow-200",
  //   "bg-red-200",
  // ];

  // const allBorders = [
  //   "border-primary",
  //   "border-blue-700",
  //   "border-green-700",
  //   "border-yellow-700",
  //   "border-red-700",
  // ];

  // const allTexts = [
  //   "text-primary",
  //   "text-blue-700",
  //   "text-green-700",
  //   "text-yellow-700",
  //   "text-red-700",
  // ];

  // const idx = Math.floor(Math.random() * allBgs.length);

  // const bg = allBgs[idx];
  // const border = allBorders[idx];
  // const text = allTexts[idx];

  const bg = "bg-gray-200";
  const border = "";
  const text = "text-gray-700";

  return (
    <Link
      href={navigation.books.reader(document.id)}
      prefetch={false}
      className="mx-auto w-full max-w-[250px]"
    >
      <div
        className={cn(
          "flex h-[350px] flex-col items-center justify-center gap-6 rounded-md border-l-8 p-8",
          bg,
          border,
          text,
        )}
      >
        <h3 className="text-center text-2xl font-semibold">
          {/* {primaryLatinName ?? primaryArabicName} */}
          {title.length > 50 ? `${title.slice(0, 50)}...` : title}
        </h3>

        <p>
          {document.author.primaryArabicName ??
            document.author.primaryLatinName}
        </p>
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
