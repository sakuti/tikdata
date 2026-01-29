"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";

interface DurationSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min: number;
  max: number;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

export function DurationSlider({
  value,
  onValueChange,
  min,
  max,
}: DurationSliderProps) {
  // Handle edge case where min equals max
  if (min >= max) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Duration</label>
        <p className="text-sm text-muted-foreground">
          All videos are {formatDuration(min)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Duration</label>
        <span className="text-sm text-muted-foreground">
          {formatDuration(value[0])} - {formatDuration(value[1])}
        </span>
      </div>
      <Slider
        value={value}
        onValueChange={(newValue) =>
          onValueChange(newValue as [number, number])
        }
        min={min}
        max={max}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatDuration(min)}</span>
        <span>{formatDuration(max)}</span>
      </div>
    </div>
  );
}
