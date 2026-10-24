"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KnowledgeCategory } from "@/services/inbox/types";
import { CATEGORY_LABELS, CATEGORY_OPTIONS } from "./constants";

interface CategorySelectProps {
  value: KnowledgeCategory;
  onChange: (value: KnowledgeCategory) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as KnowledgeCategory);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {(v: string) => CATEGORY_LABELS[v as KnowledgeCategory] ?? v}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_OPTIONS.map((c) => (
          <SelectItem key={c} value={c}>
            {CATEGORY_LABELS[c]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
