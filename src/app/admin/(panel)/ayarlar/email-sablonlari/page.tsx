import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AyarlarEmailSablonlariPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="E-posta sablonlari"
        description="Sisteminiz tarafindan gonderilen otomatik e-posta sablonlarini duzenleyin."
      />
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Bu sayfa yapilandiriliyor.
        </CardContent>
      </Card>
    </div>
  );
}
