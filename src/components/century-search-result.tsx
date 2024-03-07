/* eslint-disable react/jsx-key */
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import type { findAllYearRanges } from "@/server/services/years";
import { getNumberWithOrdinal } from "@/lib/number";
import DottedList from "./ui/dotted-list";

export default function CenturySearchResult({
  result,
}: {
  result: Awaited<ReturnType<typeof findAllYearRanges>>[number];
}) {
  const primaryTitle = `${getNumberWithOrdinal(result.centuryNumber)} Century`;

  return (
    <Link
      href={navigation.centuries.byNumber(result.centuryNumber)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-6 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%] flex-1">
          {primaryTitle && (
            <h2 className="text-xl text-foreground">{primaryTitle}</h2>
          )}

          <DottedList
            className="mt-3 text-muted-foreground"
            items={[
              <p className="text-lg">
                {result.yearFrom} - {result.yearTo} AH
              </p>,
            ]}
          />
        </div>

        <div className="flex-1 text-end">{result.totalBooks} Texts</div>
      </div>
    </Link>
  );
}
