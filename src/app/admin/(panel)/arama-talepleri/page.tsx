import { PageHeader } from "@/features/admin/components/page-header";
import { LeadsView } from "@/features/admin/leads/leads-view";

export default function AramaTalepleriPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Arama Talepleri"
        description="Elif'in topladığı ve ekibin araması gereken danışan talepleri."
      />
      <LeadsView />
    </div>
  );
}
