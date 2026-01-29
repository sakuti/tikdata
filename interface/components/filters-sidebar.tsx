"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AuthorCombobox } from "./author-combobox";
import { HashtagCombobox } from "./hashtag-combobox";
import { DateRangePicker } from "./date-range-picker";
import type {
  AuthorOption,
  HashtagOption,
  DateRange,
  VideoFilters,
} from "@/types/video";
import { DurationSlider } from "./duration-slider";

interface FiltersSidebarProps {
  filters: VideoFilters;
  authorOptions: AuthorOption[];
  hashtagOptions: HashtagOption[];
  durationBounds: { min: number; max: number };
  dateBounds: { min: Date | undefined; max: Date | undefined };
  onAuthorChange: (value: string | null) => void;
  onHashtagChange: (value: string | null) => void;
  onAdOnlyChange: (value: boolean) => void;
  onDateRangeChange: (value: DateRange) => void;
  onDurationRangeChange: (value: [number, number]) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function FiltersSidebar({
  filters,
  authorOptions,
  hashtagOptions,
  durationBounds,
  dateBounds,
  onAuthorChange,
  onHashtagChange,
  onAdOnlyChange,
  onDateRangeChange,
  onDurationRangeChange,
  onReset,
  totalCount,
  filteredCount,
}: FiltersSidebarProps) {
  const hasActiveFilters =
    filters.selectedAuthor ||
    filters.selectedHashtag ||
    filters.adOnly ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.durationRange[0] !== durationBounds.min ||
    filters.durationRange[1] !== durationBounds.max;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount.toLocaleString()} of{" "}
          {totalCount.toLocaleString()} videos
        </p>
      </div>

      <Separator />

      <AuthorCombobox
        options={authorOptions}
        value={filters.selectedAuthor}
        onValueChange={onAuthorChange}
      />

      <HashtagCombobox
        options={hashtagOptions}
        value={filters.selectedHashtag}
        onValueChange={onHashtagChange}
      />

      <DateRangePicker
        value={filters.dateRange}
        onValueChange={onDateRangeChange}
        minDate={dateBounds.min}
        maxDate={dateBounds.max}
      />

      <DurationSlider
        value={filters.durationRange}
        onValueChange={onDurationRangeChange}
        min={durationBounds.min}
        max={durationBounds.max}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="ad-only"
          checked={filters.adOnly}
          onCheckedChange={(checked) => onAdOnlyChange(checked === true)}
        />
        <label
          htmlFor="ad-only"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Show ads only
        </label>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onReset}
          >
            Reset All Filters
          </Button>
        </>
      )}
    </div>
  );
}
