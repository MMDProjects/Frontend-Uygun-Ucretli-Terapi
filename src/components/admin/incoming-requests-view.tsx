"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { IncomingRequestsToolbar } from "./incoming-requests-toolbar";

export function IncomingRequestsView() {
  const searchParams = useSearchParams();
  const danisanFilterId = searchParams.get("danisan");

  const { requests, setRequests, loading, error, refetch } =
    useIncomingRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<
    IncomingRequestStatus[]
  >([]);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messageRequest, setMessageRequest] =
    useState<IncomingRequest | null>(null);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return requests.filter((req) => {
      if (danisanFilterId) {
        if (req.danisanId !== danisanFilterId) {
          return false;
        }
      }

      const matchSearch =
        q.length === 0 ||
        req.fullName.toLowerCase().includes(q) ||
        req.email.toLowerCase().includes(q) ||
        req.subject.toLowerCase().includes(q) ||
        req.message.toLowerCase().includes(q);

      const matchStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(req.status);

      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, selectedStatuses, danisanFilterId]);

  const handleStatusToggle = (
    status: IncomingRequestStatus,
    checked: boolean
  ) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleStatusChangeRow = async (
    id: string,
    status: IncomingRequestStatus
  ) => {
    const previous = requests;
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    try {
      await updateIncomingRequestStatus(
        id,
        status,
        getAccessToken() ?? null
      );
      const hasApi = getOptionalApiBase() !== null;
      toast.success(
        hasApi
          ? "Durum güncellendi"
          : "Durum güncellendi (yerel; API bağlanınca senkron olacak)"
      );
    } catch (e) {
      setRequests(previous);
      toast.error(
        e instanceof Error ? e.message : "Durum güncellenemedi"
      );
      void refetch();
    }
  };

  const handleOpenMessage = (request: IncomingRequest) => {
    setMessageRequest(request);
    setMessageOpen(true);
  };

  return (
    <div className="flex-1 space-y-6">
      <IncomingRequestsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatuses={selectedStatuses}
        onStatusToggle={handleStatusToggle}
        onClearFilters={() => setSelectedStatuses([])}
        onRefresh={refetch}
        loading={loading}
        danisanFilterId={danisanFilterId}
      />

      {danisanFilterId ? (
        <p className="text-sm">
          <Link
            href="/formlar/talepler"
            className="text-[#3178C6] underline-offset-4 hover:underline active:opacity-80"
          >
            Tüm talepleri göster
          </Link>
        </p>
      ) : null}

      <IncomingRequestsTable
        requests={filteredRequests}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenMessage={handleOpenMessage}
        onStatusChange={handleStatusChangeRow}
      />

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">
          İpucu
        </p>
        <p className="mt-1 text-muted-foreground">
          Mesajın tamamı için “Görüntüle”ye tıklayın. Durum alanı, iletişim
          talebinin iş akışını takip etmek içindir; API bağlı değilken
          değişiklikler yalnızca bu oturumda kalır.
        </p>
      </div>

      <IncomingRequestMessageDialog
        request={messageRequest}
        open={messageOpen}
        onOpenChange={(open) => {
          setMessageOpen(open);
          if (!open) {
            window.setTimeout(() => setMessageRequest(null), 200);
          }
        }}
      />
    </div>
  );
}
