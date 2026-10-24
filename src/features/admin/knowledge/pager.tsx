"use client";

import { Button } from "@/components/ui/button";
import { PAGE_LIMIT } from "./constants";

interface PagerProps {
  page: number;
  total: number;
  disabled?: boolean;
  onChange: (page: number) => void;
}

export function Pager({ page, total, disabled, onChange }: PagerProps) {
  const pages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 pt-2 text-sm text-muted-foreground">
      <span>
        Sayfa {page} / {pages} · {total} kayıt
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Önceki
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Sonraki
        </Button>
      </div>
    </div>
  );
}
