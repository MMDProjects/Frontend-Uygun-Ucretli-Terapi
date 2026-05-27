"use client";

import * as Popover from "@radix-ui/react-popover";
import { ArrowDownWideNarrow } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortOption {
  key: string;
  label: string;
}

interface Props {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SortPopover({ options, value, onChange }: Props) {
  const hasActive = value !== options[0]?.key;

  return (
    <Popover.Root modal={false}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:bg-muted/70 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            hasActive && "border-primary bg-primary/10 text-primary-hover",
          )}
          aria-haspopup="dialog"
          aria-label="Sırala"
        >
          <ArrowDownWideNarrow className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={10}
          collisionPadding={16}
          className="z-[60] w-[min(calc(100vw-2rem),18rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Sırala</p>
              <p className="text-xs text-muted-foreground">Listeleme biçimini seçin.</p>
            </div>
            <div className="space-y-2">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onChange(opt.key)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                    value === opt.key
                      ? "border-primary bg-muted text-primary-hover"
                      : "border-border bg-background text-foreground hover:bg-muted/60",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
