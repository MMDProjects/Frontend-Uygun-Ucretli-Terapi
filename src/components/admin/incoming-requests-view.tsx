"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/auth-cookies";
import { getOptionalApiBase } from "@/lib/http-client";
import { useIncomingRequests } from "@/hooks/use-incoming-requests";
import { updateIncomingRequestStatus } from "@/services/forms/incoming-requests.service";
import type {
  IncomingRequest,
  IncomingRequestStatus,
} from "@/types/dto/incoming-request";
import { IncomingRequestMessageDialog } from "./incoming-request-message-dialog";
import { IncomingRequestsTable } from "./incoming-requests-table";

interface IncomingRequestsViewProps {
  isCorporate?: boolean;
  searchQuery: string;
  selectedStatuses: IncomingRequestStatus[];
  filterEmail?: string | null;
}

export function IncomingRequestsView({
  isCorporate,
  searchQuery,
  selectedStatuses,
  filterEmail,
}: IncomingRequestsViewProps) {
  const { requests: allRequests, setRequests: setAllRequests, loading, error, refetch } =
    useIncomingRequests();

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageRequest, setMessageRequest] = useState<IncomingRequest | null>(null);

  const requests = useMemo(
    () => allRequests.filter((r) =>
      isCorporate === undefined ? true : r.isCorporate === isCorporate
    ),
    [allRequests, isCorporate]
  );

  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const targetEmail = filterEmail?.toLowerCase().trim();
    return requests.filter((req) => {
      const matchEmail = !targetEmail || req.email.toLowerCase() === targetEmail;

      const matchSearch =
        q.length === 0 ||
        req.fullName.toLowerCase().includes(q) ||
        req.email.toLowerCase().includes(q) ||
        req.subject.toLowerCase().includes(q) ||
        req.message.toLowerCase().includes(q);

      const matchStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(req.status);

      return matchEmail && matchSearch && matchStatus;
    });
  }, [requests, searchQuery, selectedStatuses, filterEmail]);

  const setRequests = (updater: (prev: IncomingRequest[]) => IncomingRequest[]) => {
    setAllRequests((prev) => {
      const next = updater(prev);
      return prev.map((r) => next.find((n) => n.id === r.id) ?? r);
    });
  };

  const handleStatusChangeRow = async (id: string, status: IncomingRequestStatus) => {
    const previous = [...requests];
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await updateIncomingRequestStatus(id, status, getAccessToken() ?? null);
      const hasApi = getOptionalApiBase() !== null;
      toast.success(hasApi ? "Durum güncellendi" : "Durum güncellendi (yerel)");
    } catch (e) {
      setRequests(() => previous);
      toast.error(e instanceof Error ? e.message : "Durum güncellenemedi");
      void refetch();
    }
  };

  return (
    <div className="space-y-4">
      <IncomingRequestsTable
        requests={filteredRequests}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenMessage={(r) => { setMessageRequest(r); setMessageOpen(true); }}
        onStatusChange={handleStatusChangeRow}
        isCorporate={isCorporate}
      />

      <IncomingRequestMessageDialog
        request={messageRequest}
        open={messageOpen}
        onOpenChange={(open) => {
          setMessageOpen(open);
          if (!open) window.setTimeout(() => setMessageRequest(null), 200);
        }}
      />
    </div>
  );
}
