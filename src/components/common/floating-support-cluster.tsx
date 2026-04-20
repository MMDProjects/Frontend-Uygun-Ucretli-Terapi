"use client";

import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { Gift, MessageCircleMore, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";

export function FloatingSupportCluster() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-5 sm:bottom-5">
      <Popover.Root modal={false}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border-[3px] border-background bg-secondary text-secondary-foreground shadow-md ring-1 ring-primary/15 transition hover:border-background hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:text-inherit"
            aria-label="Ucretsiz on gorusme hediyesi"
          >
            <Gift className="size-7" strokeWidth={1.75} aria-hidden />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="top"
            align="end"
            sideOffset={10}
            collisionPadding={16}
            className="z-[60] w-[min(calc(100vw-2rem),17.5rem)] rounded-[var(--radius)] border border-border/80 bg-card p-4 shadow-xl outline-none"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Gift className="size-4 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    Ucretsiz on gorusme
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    WhatsApp ile kisa bir tanisma gorusmesi baslatin.
                  </p>
                </div>
              </div>
              <Popover.Close asChild>
                <button
                  type="button"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
                  aria-label="Kapat"
                >
                  <X className="size-4" />
                </button>
              </Popover.Close>
            </div>

            <Button asChild className="mt-3 w-full" size="sm">
              <Link
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp ile Baslat
              </Link>
            </Button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Link
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold !text-white shadow-lg transition hover:bg-primary-hover hover:!text-white [&_svg]:!text-white"
      >
        <MessageCircleMore className="size-4" aria-hidden />
        Canli Destek
      </Link>
    </div>
  );
}
