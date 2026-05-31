"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { toast } from "sonner";
import { ExpertDetailDialog } from "@/components/admin/expert-detail-dialog";
import { ExpertsTable } from "@/components/admin/experts-table";
import { UserWarningDialog } from "@/components/admin/user-warning-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExperts } from "@/hooks/use-experts";
import { sortExpertsByPriority } from "@/services/users/experts-list.service";
import type { ExpertListItem } from "@/types/dto/expert-list";

export function ExpertsView() {
  const {
    experts,
    loading,
    error,
    refetch,
    updatePriority,
    toggleExpertStatus,
    togglePublish,
    detail,
    detailLoading,
    openDetail,
    closeDetail,
  } = useExperts();
  const [searchQuery, setSearchQuery] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningExpert, setWarningExpert] = useState<ExpertListItem | null>(null);

  const filteredExperts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = q
      ? experts.filter(
          (item) =>
            item.fullName.toLowerCase().includes(q) ||
            item.email.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q)
        )
      : experts;
    return sortExpertsByPriority(list);
  }, [experts, searchQuery]);

  const handlePrioritySave = async (expertId: string, score: number) => {
    try {
      await updatePriority(expertId, score);
      toast.success("Öncelik skoru kaydedildi");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Öncelik skoru kaydedilemedi");
    }
  };

  const handleOpenDetail = async (expertId: string) => {
    setDetailOpen(true);
    await openDetail(expertId);
  };

  const handleOpenWarning = (expert: ExpertListItem) => {
    setWarningExpert(expert);
    setWarningOpen(true);
  };

  const handleSendWarning = (message: string, _type: string) => {
    if (!warningExpert) return;
    toast.success(`${warningExpert.fullName} için uyarı kaydedildi (API TODO)`);
    console.warn("[expert warning stub]", warningExpert.id, message, _type);
    setWarningOpen(false);
    setWarningExpert(null);
  };

  const handleStatusToggleRow = async (expertId: string) => {
    const selected = filteredExperts.find((x) => x.id === expertId);
    try {
      await toggleExpertStatus(expertId);
      const next = selected?.status === "active" ? "inactive" : "active";
      toast.success(
        `${selected?.fullName ?? "Uzman"} ${next === "active" ? "aktifleştirildi" : "askıya alındı"}`
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Durum güncellenemedi");
    }
  };

  const handleTogglePublish = async (expertId: string, isPublished: boolean) => {
    const selected = filteredExperts.find((x) => x.id === expertId);
    try {
      await togglePublish(expertId, isPublished);
      toast.success(
        `${selected?.fullName ?? "Uzman"} ${isPublished ? "yayına alındı" : "yayından kaldırıldı"}`
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yayın durumu güncellenemedi");
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <PageHeader title="Tüm uzmanlar" description="Kayıtlı uzmanları görüntüleyin, öncelik skoru atayın ve durum yönetimi yapın.">
        <div className="relative w-full sm:w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Uzman ara (ad, e-posta, ID)…"
            className="pl-9"
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          Yenile
        </Button>
      </PageHeader>

      <ExpertsTable
        experts={filteredExperts}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenDetail={(expertId) => void handleOpenDetail(expertId)}
        onSavePriority={(expertId, score) => handlePrioritySave(expertId, score)}
        onOpenWarning={handleOpenWarning}
        onStatusToggle={handleStatusToggleRow}
        onTogglePublish={handleTogglePublish}
      />

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">İpucu</p>
        <p className="mt-1 text-muted-foreground">
          Öncelik skoru yüksek olan uzmanlar listede üstte görünür. Skorlar
          tarayıcıda saklanır; API tanımlıysa sunucuya da iletilmeye çalışılır.
          Durum anahtarı ve uyarı gönderimi şu an yalnızca arayüzde; endpoint
          hazır olduğunda servis katmanına taşınacak. Masaüstünde detay için
          satıra tıklayın. Uzmanların biyografi, anahtar kelime ve belge
          bilgileri detay penceresinden incelenebilir.
        </p>
      </div>

      <UserWarningDialog
        open={warningOpen}
        onOpenChange={setWarningOpen}
        userName={warningExpert?.fullName ?? ""}
        recipientKind="uzmana"
        onSendWarning={handleSendWarning}
      />

      <ExpertDetailDialog
        expert={detail}
        loading={detailLoading}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            closeDetail();
            return;
          }
          if (detailLoading) {
            toast.info("Uzman detayı yükleniyor...");
          }
        }}
      />
    </div>
  );
}
