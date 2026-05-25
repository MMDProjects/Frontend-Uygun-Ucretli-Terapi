import { ContentPublishForm } from "@/components/admin/content-publish-form";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/features/admin/components/page-header";

export default function IcerikYayinlaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="İçerik yayınla"
        description="Oluşturduğunuz içerik, onaylandıktan sonra kullanıcılar tarafından görüntülenebilecek."
      />
      <Card className="rounded-lg border border-border shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <CardContent className="pt-6">
          <ContentPublishForm embedInPage />
        </CardContent>
      </Card>
    </div>
  );
}
