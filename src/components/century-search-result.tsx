/* eslint-disable react/jsx-key */
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import type { findAllYearRanges } from "@/server/services/years";
import DottedList from "./ui/dotted-list";
import { getFormatter, getTranslations } from "next-intl/server";

export default async function CenturySearchResult({
  result,
}: {
  result: Awaited<ReturnType<typeof findAllYearRanges>>[number];
}) {
  const t = await getTranslations();
  const formatter = await getFormatter();

  return (
    <Link
      href={navigation.centuries.byNumber(result.centuryNumber)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-6 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%] flex-1">
          <h2 className="text-xl text-foreground">
            {t("entities.ordinal-century", {
              count: result.centuryNumber,
            })}
          </h2>

          <DottedList
            className="mt-3 text-muted-foreground"
            items={[
              <p className="text-lg">
                {formatter.number(result.yearFrom, { useGrouping: false })} -{" "}
                {formatter.number(result.yearTo, { useGrouping: false })}{" "}
                {t("common.year-format.ah.title")}
              </p>,
            ]}
          />
        </div>

        <div className="flex-1 text-end">
          {t("entities.x-texts", { count: result.totalBooks })}
        </div>
      </div>
    </Link>
  );
}
