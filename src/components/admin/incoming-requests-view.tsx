"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/auth-cookies";
import { getOptionalApiBase } from "@/lib/http-client";
import { Pager } from "@/components/shared/pager";
import {
  INCOMING_REQUESTS_PAGE_LIMIT,
  useIncomingRequests,
} from "@/hooks/use-incoming-requests";
import { updateIncomingRequestStatus } from "@/services/forms/incoming-requests.service";
import type {
  IncomingRequest,
  IncomingRequestStatus,
} from "@/types/dto/incoming-request";
import { IncomingRequestMessageDialog } from "./incoming-request-message-dialog";
import { IncomingRequestsTable } from "./incoming-requests-table";

interface IncomingRequestsViewProps {
  isCorporate?: boolean;
  /** Backend'e giden (debounce edilmiş) arama metni. */
  searchQuery: string;
  selectedStatuses: IncomingRequestStatus[];
  filterEmail?: string | null;
  page: number;
  onPageChange: (page: number) => void;
}

export function IncomingRequestsView({
  isCorporate,
  searchQuery,
  selectedStatuses,
  filterEmail,
  page,
  onPageChange,
}: IncomingRequestsViewProps) {
  const { requests, setRequests, total, loading, error, refetch } = useIncomingRequests({
    page,
    isCorporate,
    statuses: selectedStatuses,
    search: searchQuery,
    email: filterEmail,
    onPageOverflow: onPageChange,
  });

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageRequest, setMessageRequest] = useState<IncomingRequest | null>(null);

  const handleStatusChangeRow = async (id: string, status: IncomingRequestStatus) => {
    const previous = [...requests];
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await updateIncomingRequestStatus(id, status, getAccessToken() ?? null);
      const hasApi = getOptionalApiBase() !== null;
      toast.success(hasApi ? "Durum güncellendi" : "Durum güncellendi (yerel)");
    } catch (e) {
      setRequests(previous);
      toast.error(e instanceof Error ? e.message : "Durum güncellenemedi");
      void refetch();
    }
  };

  return (
    <div className="space-y-4">
      <IncomingRequestsTable
        requests={requests}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenMessage={(r) => { setMessageRequest(r); setMessageOpen(true); }}
        onStatusChange={handleStatusChangeRow}
        isCorporate={isCorporate}
      />

      {!error ? (
        <Pager
          page={page}
          total={total}
          limit={INCOMING_REQUESTS_PAGE_LIMIT}
          disabled={loading}
          onChange={onPageChange}
        />
      ) : null}

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
