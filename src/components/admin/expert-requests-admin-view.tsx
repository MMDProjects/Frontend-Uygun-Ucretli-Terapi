"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock, MessageSquare, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listAdminExpertRequests,
  updateAdminExpertRequestStatus,
  type AdminExpertRequest,
  type AdminExpertRequestStatus,
} from "@/services/forms/expert-requests-admin.service";

const STATUS_CONFIG: Record<
  AdminExpertRequestStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  BEKLEMEDE: {
    label: "Beklemede",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  UZMANA_YONLENDIRILDI: {
    label: "Yanıtlandı",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: MessageSquare,
  },
  TAMAMLANDI: {
    label: "Tamamlandı",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  REDDEDILDI: {
    label: "Reddedildi",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const STATUS_OPTIONS: AdminExpertRequestStatus[] = [
  "BEKLEMEDE",
  "UZMANA_YONLENDIRILDI",
  "TAMAMLANDI",
  "REDDEDILDI",
];

function StatusBadge({ status }: { status: AdminExpertRequestStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        cfg.className
      )}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function RequestRow({
  req,
  onStatusChange,
}: {
  req: AdminExpertRequest;
  onStatusChange: (id: string, status: AdminExpertRequestStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const danisanName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const uzmanName = `${req.expertProfile.user.firstName} ${req.expertProfile.user.lastName}`.trim();
  const date = new Date(req.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleChange(status: AdminExpertRequestStatus) {
    setUpdating(true);
    try {
      await onStatusChange(req.id, status);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{date}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{danisanName}</p>
        <a
          href={`mailto:${req.user.email}`}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          {req.user.email}
        </a>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{uzmanName}</td>
      <td className="px-4 py-3 max-w-xs">
        <p className="text-sm text-foreground line-clamp-2">{req.message}</p>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={req.status} />
      </td>
      <td className="px-4 py-3">
        <select
          disabled={updating}
          value={req.status}
          onChange={(e) => handleChange(e.target.value as AdminExpertRequestStatus)}
          className="rounded-lg border border-border/60 bg-white px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

function MobileCard({
  req,
  onStatusChange,
}: {
  req: AdminExpertRequest;
  onStatusChange: (id: string, status: AdminExpertRequestStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const danisanName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const uzmanName = `${req.expertProfile.user.firstName} ${req.expertProfile.user.lastName}`.trim();
  const date = new Date(req.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleChange(status: AdminExpertRequestStatus) {
    setUpdating(true);
    try {
      await onStatusChange(req.id, status);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{danisanName}</p>
          <p className="text-xs text-muted-foreground">{req.user.email}</p>
        </div>
        <StatusBadge status={req.status} />
      </div>
      <div className="text-xs text-muted-foreground">
        Uzman: <span className="font-medium text-foreground">{uzmanName}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3">{req.message}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{date}</span>
        <select
          disabled={updating}
          value={req.status}
          onChange={(e) => handleChange(e.target.value as AdminExpertRequestStatus)}
          className="rounded-lg border border-border/60 bg-white px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ExpertRequestsAdminView() {
  const [requests, setRequests] = useState<AdminExpertRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  async function load(p: number) {
    setLoading(true);
    try {
      const res = await listAdminExpertRequests(p, limit);
      setRequests(res.data);
      setTotal(res.total);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Talepler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(page);
  }, [page]);

  async function handleStatusChange(
    id: string,
    status: AdminExpertRequestStatus
  ) {
    const prev = requests;
    setRequests((r) => r.map((req) => (req.id === id ? { ...req, status } : req)));
    try {
      await updateAdminExpertRequestStatus(id, status);
      toast.success("Durum güncellendi.");
    } catch {
      setRequests(prev);
      toast.error("Durum güncellenemedi.");
    }
  }

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-16 text-center">
        <MessageSquare className="mb-3 size-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-muted-foreground">Uzman talebi bulunamadı</p>
        <button
          type="button"
          onClick={() => load(1)}
          className="mt-4 flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/30 hover:text-primary transition"
        >
          <RefreshCw className="size-3" />
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Toplam {total} talep</p>
        <button
          type="button"
          onClick={() => load(page)}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/30 hover:text-primary transition"
        >
          <RefreshCw className="size-3" />
          Yenile
        </button>
      </div>

      {/* Masaüstü tablo */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border/60 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Tarih</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Danışan</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Uzman</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Mesaj</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Durum</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Güncelle</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <RequestRow key={req.id} req={req} onStatusChange={handleStatusChange} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil kartlar */}
      <div className="md:hidden space-y-3">
        {requests.map((req) => (
          <MobileCard key={req.id} req={req} onStatusChange={handleStatusChange} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
          >
            ← Önceki
          </button>
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
