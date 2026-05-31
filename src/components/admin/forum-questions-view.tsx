"use client";

import { useEffect, useState } from "react";
import { Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { useForumQuestions } from "@/hooks/use-forum-questions";
import { listExperts } from "@/services/users/experts-list.service";
import type { ExpertListItem } from "@/types/dto/expert-list";
import { PageHeader } from "@/features/admin/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { AdminForumQuestion } from "@/services/forum/forum-admin.service";

const TABS = [
  { key: "ONAY_BEKLIYOR" as const, label: "Onay Bekliyor" },
  { key: "ATANDI" as const, label: "Uzmana Atandı" },
  { key: "CEVAPLANDI" as const, label: "Yanıtlandı" },
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

interface AssignDialogProps {
  question: AdminForumQuestion | null;
  experts: ExpertListItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (questionId: string, expertProfileId: string) => Promise<void>;
}

function AssignDialog({
  question,
  experts,
  open,
  onOpenChange,
  onAssign,
}: AssignDialogProps) {
  const [selectedExpert, setSelectedExpert] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || !selectedExpert) return;
    setSubmitting(true);
    try {
      await onAssign(question.id, selectedExpert);
      toast.success("Soru uzmana atandı.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Atama başarısız");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setSelectedExpert("");
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Uzmana Ata</DialogTitle>
          <DialogDescription>
            {question ? `"${question.title}"` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-1">
          <div className="grid gap-2">
            <Label htmlFor="expert-select">Uzman seç</Label>
            <Select
              value={selectedExpert}
              onValueChange={setSelectedExpert}
              disabled={submitting}
            >
              <SelectTrigger id="expert-select">
                <SelectValue placeholder="Uzman seçin…" />
              </SelectTrigger>
              <SelectContent>
                {experts.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              disabled={submitting || !selectedExpert}
              className="bg-[#016a59] hover:bg-[#014a3e]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Atanıyor
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 size-4" />
                  Ata
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ForumQuestionsView() {
  const {
    questions,
    loading,
    error,
    activeTab,
    setActiveTab,
    refetch,
    assign,
    approveAnswer,
  } = useForumQuestions();

  const [experts, setExperts] = useState<ExpertListItem[]>([]);
  const [assignTarget, setAssignTarget] = useState<AdminForumQuestion | null>(
    null
  );

  useEffect(() => {
    listExperts().then(setExperts);
  }, []);

  async function handleApproveAnswer(
    answerId: string,
    questionId: string
  ) {
    try {
      await approveAnswer(answerId, questionId);
      toast.success("Cevap onaylandı, forum'da yayınlandı.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Onay başarısız");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forum soruları"
        description="Danışanların sorularını inceleyin, uzmana atayın ve uzman cevaplarını onaylayın."
      />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? "rounded-md bg-white px-4 py-1.5 text-sm font-medium text-foreground shadow-sm"
                : "rounded-md px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Sorular yükleniyor…
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="border-[#EB5757]/30 bg-[#EB5757]/5">
          <CardContent className="flex flex-col gap-3 py-6">
            <p className="text-sm text-[#EB5757]">{error}</p>
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => void refetch()}
            >
              Tekrar dene
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!loading && !error && questions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {activeTab === "ONAY_BEKLIYOR" && "Onay bekleyen soru bulunmuyor."}
            {activeTab === "ATANDI" && "Uzmana atanmış, cevap bekleyen soru bulunmuyor."}
            {activeTab === "CEVAPLANDI" && "Cevap onayı bekleyen soru bulunmuyor."}
          </CardContent>
        </Card>
      )}

      {/* Liste */}
      {!loading && !error && questions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((q) => (
            <Card
              key={q.id}
              className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {activeTab === "ONAY_BEKLIYOR" && (
                    <Badge
                      variant="outline"
                      className="border-[#F2994A]/40 bg-[#F2994A]/10 text-[#F2994A]"
                    >
                      Onay Bekliyor
                    </Badge>
                  )}
                  {activeTab === "ATANDI" && (
                    <Badge
                      variant="outline"
                      className="border-[#3178C6]/40 bg-[#3178C6]/10 text-[#3178C6]"
                    >
                      Uzmana Atandı
                    </Badge>
                  )}
                  {activeTab === "CEVAPLANDI" && (
                    <Badge
                      variant="outline"
                      className="border-[#27AE60]/40 bg-[#27AE60]/10 text-[#27AE60]"
                    >
                      Yanıtlandı
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(q.createdAt)}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">
                  {q.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {q.content}
                </p>

                {/* Danışan bilgisi */}
                {q.user && (
                  <p className="text-xs text-[#24292E]">
                    Danışan:{" "}
                    {`${q.user.firstName} ${q.user.lastName}`.trim() ||
                      q.user.email}
                  </p>
                )}

                {/* ATANDI — uzman göster */}
                {activeTab === "ATANDI" && q.expertProfileId && (
                  <p className="text-xs text-[#3178C6]">
                    Atanan uzman profil ID: {q.expertProfileId}
                  </p>
                )}

                {/* CEVAPLANDI — cevapları listele */}
                {activeTab === "CEVAPLANDI" &&
                  q.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="rounded-md border border-border bg-muted/30 px-3 py-2 space-y-2"
                    >
                      <p className="text-xs font-medium text-foreground">
                        {`${ans.expertProfile.user.firstName} ${ans.expertProfile.user.lastName}`.trim()}{" "}
                        —{" "}
                        <span className="font-normal text-muted-foreground">
                          {ans.expertProfile.title}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {ans.content}
                      </p>
                      {ans.isApproved ? (
                        <Badge
                          variant="outline"
                          className="border-[#27AE60]/40 bg-[#27AE60]/10 text-[#27AE60] text-xs"
                        >
                          Onaylandı
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="bg-[#27AE60] hover:bg-[#229954] active:bg-[#1e874b]"
                          onClick={() =>
                            void handleApproveAnswer(ans.id, q.id)
                          }
                        >
                          Cevabı Onayla
                        </Button>
                      )}
                    </div>
                  ))}

                {/* Aksiyonlar */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  {activeTab === "ONAY_BEKLIYOR" && (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-[#016a59] hover:bg-[#014a3e]"
                      onClick={() => setAssignTarget(q)}
                    >
                      <UserCheck className="mr-1.5 size-3.5" />
                      Uzmana Ata
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AssignDialog
        key={assignTarget?.id ?? "closed"}
        question={assignTarget}
        experts={experts}
        open={assignTarget !== null}
        onOpenChange={(open) => {
          if (!open) setAssignTarget(null);
        }}
        onAssign={assign}
      />
    </div>
  );
}
