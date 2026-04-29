"use client";

import { useState } from "react";
import { MessageSquare, Mail, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { MOCK_DANISAN_REQUESTS } from "@/features/uzman/data/mock-uzman";
import type { UzmanDanisanRequest, ExpertRequestStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

const STATUS_TABS: { label: string; value: ExpertRequestStatus | "Tümü" }[] = [
  { label: "Tümü", value: "Tümü" },
  { label: "Beklemede", value: "Beklemede" },
  { label: "Yanıtlandı", value: "Yanıtlandı" },
  { label: "Tamamlandı", value: "Tamamlandı" },
];

const STATUS_CONFIG = {
  Beklemede: {
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  Yanıtlandı: {
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: MessageSquare,
  },
  Tamamlandı: {
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
} as const;

function RequestCard({ req }: { req: UzmanDanisanRequest }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[req.status];
  const StatusIcon = config.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
          {req.danisanName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{req.danisanName}</p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                config.className
              )}
            >
              <StatusIcon className="size-3" />
              {req.status}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{req.message}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{req.dateLabel}</p>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4">
          <div className="mb-4 rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Mesaj</p>
            <p className="text-sm text-foreground">{req.message}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {req.email && (
              <a
                href={`mailto:${req.email}`}
                className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              >
                <Mail className="size-3.5" />
                {req.email}
              </a>
            )}

            {req.status === "Beklemede" && (
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
              >
                Yanıtla
              </button>
            )}
            {req.status === "Yanıtlandı" && (
              <button
                type="button"
                className="rounded-xl bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
              >
                Tamamlandı İşaretle
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UzmanTaleplerPage() {
  const [activeTab, setActiveTab] = useState<ExpertRequestStatus | "Tümü">("Tümü");

  const filtered =
    activeTab === "Tümü"
      ? MOCK_DANISAN_REQUESTS
      : MOCK_DANISAN_REQUESTS.filter((r) => r.status === activeTab);

  const counts = {
    Tümü: MOCK_DANISAN_REQUESTS.length,
    Beklemede: MOCK_DANISAN_REQUESTS.filter((r) => r.status === "Beklemede").length,
    Yanıtlandı: MOCK_DANISAN_REQUESTS.filter((r) => r.status === "Yanıtlandı").length,
    Tamamlandı: MOCK_DANISAN_REQUESTS.filter((r) => r.status === "Tamamlandı").length,
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
              activeTab === value
                ? "border-primary bg-primary text-white"
                : "border-border/60 bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            {label}
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                activeTab === value ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-16 text-center">
          <MessageSquare className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">Bu kategoride talep yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <RequestCard key={req.id} req={req} />
          ))}
        </div>
      )}
    </div>
  );
}
