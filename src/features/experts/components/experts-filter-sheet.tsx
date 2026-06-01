"use client";

import { Star } from "lucide-react";
import { FilterPopover, filterChip } from "@/components/shared/filter-popover";

const TAGS = [
  "Kaygı", "Depresyon", "Stres", "Uyku", "İlişki",
  "Aile", "Panik Atak", "Tükenmişlik", "Özgüven", "Yas",
  "Travma", "Öfke", "Motivasyon", "Sosyal Fobi",
];

export type ExpertFilters = {
  tags: string[];
  minRating: number;
  days: number[];
};

interface Props {
  filters: ExpertFilters;
  onChange: (filters: ExpertFilters) => void;
  hasActive: boolean;
}

export function ExpertsFilterSheet({ filters, onChange }: Props) {
  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: next });
  }

  const activeCount = filters.tags.length + (filters.minRating > 0 ? 1 : 0);

  return (
    <FilterPopover
      activeCount={activeCount}
      onClear={() => onChange({ tags: [], minRating: 0, days: [] })}
    >
      {/* Uzmanlık Alanı */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Uzmanlık Alanı</p>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={filterChip(filters.tags.includes(tag))}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Puan */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Minimum Puan</p>
        <div className="flex gap-1.5">
          {[0, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ ...filters, minRating: rating })}
              className={filterChip(filters.minRating === rating)}
            >
              {rating === 0 ? (
                "Tümü"
              ) : (
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-current" />
                  {rating}+
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </FilterPopover>
  );
}
