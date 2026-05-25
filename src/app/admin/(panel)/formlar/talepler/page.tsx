import { Suspense } from "react";
import { IncomingRequestsView } from "@/components/admin/incoming-requests-view";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
    </div>
  );
}

export default function GelenTaleplerPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <IncomingRequestsView />
    </Suspense>
  );
}
