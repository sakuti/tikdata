"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiltersSidebar } from "./filters-sidebar";
import type {
  AuthorOption,
  HashtagOption,
  DateRange,
  VideoFilters,
} from "@/types/video";

interface MobileFiltersProps {
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

export function MobileFilters(props: MobileFiltersProps) {
  const activeFilterCount = [
    props.filters.selectedAuthor,
    props.filters.selectedHashtag,
    props.filters.adOnly,
    props.filters.dateRange.from || props.filters.dateRange.to,
    props.filters.durationRange[0] !== props.durationBounds.min ||
      props.filters.durationRange[1] !== props.durationBounds.max,
  ].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="xl:hidden bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-75 sm:w-100">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] mt-4 pr-4">
          <FiltersSidebar {...props} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
