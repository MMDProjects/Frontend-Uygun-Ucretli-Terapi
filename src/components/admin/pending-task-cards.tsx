"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  FileText,
  Inbox,
  Loader2,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePendingTasks } from "@/hooks/use-pending-tasks";
import { cn } from "@/lib/utils";
import type { PendingTaskType, TaskUrgency } from "@/types/dto/pending-task";

const taskIcons: Record<PendingTaskType, LucideIcon> = {
  uzman_basvuru: UserPlus,
  profil_guncelleme: UserCheck,
  blog_onay: FileText,
  yeni_talep: Inbox,
};

const urgencyConfig: Record<
  TaskUrgency,
  { label: string; className: string }
> = {
  high: {
    label: "Öncelikli",
    className:
      "border border-destructive/25 bg-destructive/8 text-destructive dark:bg-destructive/15",
  },
  medium: {
    label: "Normal",
    className:
      "border border-amber-500/25 bg-amber-500/8 text-amber-950 dark:text-amber-100 dark:bg-amber-500/15",
  },
  low: {
    label: "Rutin",
    className:
      "border border-border bg-muted/60 text-muted-foreground",
  },
};

export function PendingTaskCards() {
  const { tasks, loading, error, refetch } = usePendingTasks();

  if (loading) {
    return (
      <div className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-muted-foreground/80" />
        <span>Görevler yükleniyor…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col gap-3 pt-6">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => void refetch()}
          >
            Tekrar dene
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-emerald-600/20 bg-emerald-600/[0.06] dark:bg-emerald-600/10">
        <CardContent className="flex items-center gap-3 py-8">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-400"
            aria-hidden
          >
            <span className="text-lg font-semibold leading-none">✓</span>
          </div>
          <div>
            <p className="font-medium text-emerald-900 dark:text-emerald-100">
              Tüm işler tamamlandı
            </p>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80">
              Bekleyen kuyruk yok. Harika iş çıkardınız.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => {
        const Icon = taskIcons[task.type];
        const urgency = urgencyConfig[task.urgency];
        return (
          <li key={task.type}>
            <Card
              size="sm"
              className={cn(
                "h-full transition-[box-shadow,transform] duration-200",
                "hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.05)]",
                "hover:-translate-y-px"
              )}
            >
              <CardHeader className="border-b border-border/60 pb-3">
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#00A86B]/10 text-[#00A86B]"
                    aria-hidden
                  >
                    <Icon className="size-[1.125rem]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <CardTitle className="text-[0.9375rem] font-semibold leading-snug text-foreground">
                      {task.label}
                    </CardTitle>
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide",
                        urgency.className
                      )}
                    >
                      {urgency.label}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                    {task.count}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    bekleyen
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-0">
                <Link
                  href={task.href}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 py-3 text-sm font-medium",
                    "text-[#3178C6] transition-colors hover:bg-muted/70 hover:text-[#3178C6]/90",
                    "active:bg-muted"
                  )}
                >
                  Kuyruğu aç
                  <ArrowRight className="size-4 shrink-0 opacity-80" />
                </Link>
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
