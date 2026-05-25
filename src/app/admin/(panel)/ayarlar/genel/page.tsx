import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AyarlarGenelPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Genel ayarlar"
        description="Platform genelinde gecerli temel ayarlari yonetin."
      />
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Bu sayfa yapilandiriliyor.
        </CardContent>
      </Card>
    </div>
  );
}
