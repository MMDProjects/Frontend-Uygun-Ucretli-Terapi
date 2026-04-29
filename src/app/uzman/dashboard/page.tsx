import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ProfileStatusBadge } from "@/features/uzman/components/profile-status-badge";
import {
  MOCK_UZMAN_PROFILE,
  MOCK_UZMAN_STATS,
  MOCK_DANISAN_REQUESTS,
  MOCK_NOTIFICATIONS,
} from "@/features/uzman/data/mock-uzman";
import { cn } from "@/lib/utils";
import type { UzmanDanisanRequest } from "@/types/domain";

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className={cn("flex size-8 items-center justify-center rounded-xl", iconClass)}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function RequestRow({ req }: { req: UzmanDanisanRequest }) {
  const statusConfig = {
    Beklemede: "bg-amber-50 text-amber-700 border-amber-200",
    Yanıtlandı: "bg-blue-50 text-blue-700 border-blue-200",
    Tamamlandı: "bg-green-50 text-green-700 border-green-200",
  } as const;

  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 py-3.5 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{req.danisanName}</p>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              statusConfig[req.status]
            )}
          >
            {req.status}
          </span>
        </div>
        <p className="line-clamp-1 text-xs text-muted-foreground">{req.message}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">{req.dateLabel}</p>
      </div>
    </div>
  );
}

export default function UzmanDashboardPage() {
  const profile = MOCK_UZMAN_PROFILE;
  const stats = MOCK_UZMAN_STATS;
  const recentRequests = MOCK_DANISAN_REQUESTS.slice(0, 4);
  const unreadNotifCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
  const pendingRequestCount = MOCK_DANISAN_REQUESTS.filter(
    (r) => r.status === "Beklemede"
  ).length;

  const hasAdminNote = profile.status === "pasif" && profile.adminNote;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Hoş Geldiniz, Dr. Ayşe Kaya
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Bugün {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProfileStatusBadge status={profile.status} />
          {profile.status === "taslak" && (
            <Link
              href="/uzman/profil"
              className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              Profile Git →
            </Link>
          )}
        </div>
      </div>

      {/* Action alerts */}
      {(hasAdminNote || profile.status === "taslak" || unreadNotifCount > 0 || pendingRequestCount > 0) && (
        <div className="space-y-2">
          {profile.status === "taslak" && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  Profiliniz henüz tamamlanmamış
                </p>
                <p className="mt-0.5 text-xs text-amber-700">
                  Profili tamamlayın ve onaya gönderin, danışanlar sizi bulsun.
                </p>
              </div>
              <Link
                href="/uzman/profil"
                className="shrink-0 text-xs font-semibold text-amber-700 hover:underline"
              >
                Düzenle →
              </Link>
            </div>
          )}

          {hasAdminNote && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-red-800">Profil Reddedildi</p>
                <p className="mt-0.5 text-xs text-red-700">{profile.adminNote}</p>
              </div>
            </div>
          )}

          {pendingRequestCount > 0 && (
            <Link
              href="/uzman/talepler"
              className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 transition hover:border-green-300"
            >
              <CheckCircle2 className="size-4 shrink-0 text-green-600" />
              <p className="flex-1 text-sm font-semibold text-green-800">
                {pendingRequestCount} bekleyen danışan talebi var
              </p>
              <ArrowRight className="size-4 text-green-600" />
            </Link>
          )}

          {unreadNotifCount > 0 && (
            <Link
              href="/uzman/bildirimler"
              className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-300"
            >
              <Clock className="size-4 shrink-0 text-blue-600" />
              <p className="flex-1 text-sm font-semibold text-blue-800">
                {unreadNotifCount} okunmamış bildiriminiz var
              </p>
              <ArrowRight className="size-4 text-blue-600" />
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Toplam Talep"
          value={stats.totalRequests}
          icon={MessageSquare}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Bekleyen"
          value={stats.pendingRequests}
          icon={Clock}
          iconClass="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Yıldız Puanı"
          value={`${stats.rating} / 5`}
          icon={Star}
          iconClass="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          label="Değerlendirme"
          value={stats.reviewCount}
          icon={TrendingUp}
          iconClass="bg-green-100 text-green-600"
        />
      </div>

      {/* Recent requests */}
      <div className="rounded-2xl border border-border/60 bg-white">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <h3 className="text-sm font-bold text-foreground">Son Danışan Talepleri</h3>
          <Link
            href="/uzman/talepler"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="px-5">
          {recentRequests.map((req) => (
            <RequestRow key={req.id} req={req} />
          ))}
        </div>
      </div>
    </div>
  );
}
