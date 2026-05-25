import { PendingTaskCards } from "@/components/admin/pending-task-cards";
import { DashboardContentActions } from "@/components/admin/dashboard-content-actions";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/admin/components/page-header";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title={"Anasayfa"}
        description={"Bekleyen isleri takip edin ve platform istatistiklerine hizlica goz atin."}
      />

      <section
        aria-labelledby="pending-heading"
        className="rounded-xl border border-border/80 bg-card/40 p-4 shadow-[0_4px_6px_rgba(0,0,0,0.04)] sm:p-6"
      >
        <h2
          id="pending-heading"
          className="mb-4 text-sm font-semibold tracking-tight text-foreground"
        >
          Bekleyen işler
        </h2>
        <PendingTaskCards />
      </section>

      <section aria-labelledby="stats-heading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 id="stats-heading" className="sr-only">
          Özet istatistikler
        </h2>
        {[
          { label: "Aktif uzman", value: "—" },
          { label: "Bu ay yeni danışan", value: "—" },
          { label: "Bu ay talep", value: "—" },
          { label: "Aktif blog", value: "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-muted/30 px-4 py-3 text-center"
          >
            <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled>
          Yeni uzman (manuel)
        </Button>
        <DashboardContentActions />
        <Button type="button" size="sm" variant="secondary" disabled>
          Uzman listesi export
        </Button>
      </section>

      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="mb-2 text-sm font-semibold">
          Son aktivite
        </h2>
        <p className="text-sm text-muted-foreground">
          Audit akışı buraya bağlanacak (son 10 olay).
        </p>
      </section>
    </div>
  );
}
