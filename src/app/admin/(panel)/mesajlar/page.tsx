import { Suspense } from "react";
import { InboxView } from "@/features/admin/inbox/inbox-view";

export const metadata = { title: "Mesajlar" };

export default function AdminMesajlarPage() {
  return (
    <Suspense fallback={null}>
      <InboxView />
    </Suspense>
  );
}
