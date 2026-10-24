"use client";

import { Label } from "@/components/ui/label";
import { PII_HINT, PII_LABEL } from "./constants";

interface PiiCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PiiCheckbox({ id, checked, onChange }: PiiCheckboxProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <div className="space-y-0.5">
        <Label htmlFor={id} className="cursor-pointer">
          {PII_LABEL}
        </Label>
        <p className="text-xs text-muted-foreground">{PII_HINT}</p>
      </div>
    </div>
  );
}
