import FilterContainer from "@/components/search-results/filter-container";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { YearFilterProps } from "./";
import { getTranslations } from "next-intl/server";

export default async function YearFilterSkeleton({
  defaultRange,
  maxYear,
}: YearFilterProps) {
  const t = await getTranslations();

  return (
    <FilterContainer
      title={t("entities.year")}
      titleChildren={<span className="h-6 w-14 rounded-full bg-gray-200" />}
    >
      <div className="mt-4">
        <Slider
          value={defaultRange}
          min={1}
          max={maxYear}
          minStepsBetweenThumbs={1}
          step={1}
          disabled
        />

        <div className="font-inter mt-4 flex justify-between gap-1">
          <Input
            placeholder={t("common.from")}
            type="number"
            disabled
            className="max-w-[80px]"
          />

          <Input
            placeholder={t("common.to")}
            type="number"
            disabled
            className="max-w-[80px]"
          />
        </div>
      </div>
    </FilterContainer>
  );
}
