import { PageHeader } from "@/features/admin/components/page-header";
import { Bell } from "lucide-react";

export default function AdminBildirimlerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bildirimler"
        description="Sisteme ait bildirimler ve uzman uyarıları burada listelenir."
      />

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
        <Bell className="mb-3 size-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">Henüz bildirim yok</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Uzmanlara uyarı gönderme özelliği yakında aktif olacak.
        </p>
      </div>
    </div>
  );
}
