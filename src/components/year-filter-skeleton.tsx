import FilterContainer from "@/components/search-results/filter-container";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { YearFilterProps } from "./year-filter";

export default function YearFilterSkeleton({
  defaultRange,
  maxYear,
}: YearFilterProps) {
  return (
    <FilterContainer
      title="Year"
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
            placeholder="From"
            type="number"
            disabled
            className="max-w-[80px]"
          />

          <Input
            placeholder="To"
            type="number"
            disabled
            className="max-w-[80px]"
          />
        </div>
      </div>
    </FilterContainer>
  );
}
