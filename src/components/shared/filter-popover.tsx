"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  activeCount: number;
  onClear: () => void;
  children: React.ReactNode;
}

export function FilterPopover({ activeCount, onClear, children }: Props) {
  const [open, setOpen] = useState(false);
  const hasActive = activeCount > 0;

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition-colors hover:bg-muted/70 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            hasActive && "border-primary bg-primary/10 text-primary-hover",
          )}
          aria-haspopup="dialog"
          aria-label="Filtrele"
        >
          <SlidersHorizontal className="size-5" strokeWidth={2} aria-hidden />
          {hasActive && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={10}
          collisionPadding={16}
          className="z-[60] w-[min(calc(100vw-2rem),22rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">Filtrele</p>
                <p className="text-xs text-muted-foreground">Listeyi daraltın.</p>
              </div>
              {hasActive && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-medium text-primary transition hover:text-primary-hover"
                >
                  Temizle ({activeCount})
                </button>
              )}
            </div>
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export const filterChip = (active: boolean) =>
  cn(
    "rounded-full border px-2.5 py-1 text-xs font-medium transition",
    active
      ? "border-primary bg-primary text-white"
      : "border-border bg-muted text-foreground hover:border-primary/40 hover:text-primary",
  );
