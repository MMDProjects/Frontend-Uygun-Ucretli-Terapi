import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AyarlarKategorilerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Filtre / kategori"
        description="Uzman listesinde kullanilan filtre kategorilerini ve anahtar kelimeleri yonetin."
      />
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Bu sayfa yapilandiriliyor.
        </CardContent>
      </Card>
    </div>
  );
}
