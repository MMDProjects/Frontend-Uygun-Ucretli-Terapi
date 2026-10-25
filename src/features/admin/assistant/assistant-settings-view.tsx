"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  updateAssistantSettings,
  useAssistantSettings,
  type AssistantMode,
} from "@/services/inbox/assistant-settings.service";
import { MODE_DESCRIPTIONS, MODE_LABELS, MODE_ORDER } from "./assistant-modes";

const NOTICE_MAX = 1000;

export function AssistantSettingsView() {
  const { settings, error, reload } = useAssistantSettings();
  const [pending, setPending] = useState<AssistantMode | null>(null);
  const [savingMode, setSavingMode] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [savingNotice, setSavingNotice] = useState(false);

  if (!settings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Asistan Ayarları" />
        {error ? (
          <div className="space-y-3 rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-destructive">Ayarlar yüklenemedi.</p>
            <Button variant="outline" onClick={reload} aria-label="Ayarları tekrar yükle">
              Tekrar dene
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
        )}
      </div>
    );
  }

  const confirmMode = async () => {
    if (!pending) return;
    setSavingMode(true);
    try {
      await updateAssistantSettings({ mode: pending });
      toast.success(`Asistan modu "${MODE_LABELS[pending]}" olarak ayarlandı`);
      setPending(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mod değiştirilemedi");
    } finally {
      setSavingMode(false);
    }
  };

  const saveNotice = async () => {
    setSavingNotice(true);
    try {
      const trimmed = notice.trim();
      await updateAssistantSettings({
        noticeText: trimmed === "" ? null : trimmed,
      });
      setDraft(null);
      toast.success("Aydınlatma metni kaydedildi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSavingNotice(false);
    }
  };

  const notice = draft ?? settings.noticeText ?? "";
  const noticeDirty = notice.trim() !== (settings.noticeText ?? "");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asistan Ayarları"
        description="Elif'in çalışma modunu ve danışanlara gösterilen aydınlatma metnini yönetin."
      />

      {!settings.envEnabled ? (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-medium">
              Asistan sunucu ayarıyla kapalı (ASSISTANT_ENABLED). Burada seçilen mod,
              sunucu ayarı açılana kadar uygulanmaz.
            </p>
            <p>Geçerli mod: {MODE_LABELS[settings.effectiveMode]}</p>
          </div>
        </div>
      ) : null}

      <section className="space-y-3 rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Çalışma modu</h2>
        <div role="radiogroup" aria-label="Asistan modu" className="grid gap-3 md:grid-cols-3">
          {MODE_ORDER.map((m) => {
            const active = settings.mode === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`${MODE_LABELS[m]} modu`}
                onClick={() => {
                  if (!active) setPending(m);
                }}
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                )}
              >
                <span className="block text-sm font-semibold">{MODE_LABELS[m]}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {MODE_DESCRIPTIONS[m]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Aydınlatma metni</h2>
        <p className="text-sm text-amber-700">
          Hukuki onaydan geçmeden doldurmayın. Boş bırakılırsa gönderilmez.
        </p>
        <Textarea
          value={notice}
          maxLength={NOTICE_MAX}
          rows={6}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Aydınlatma metni"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {notice.length}/{NOTICE_MAX}
          </span>
          <Button
            onClick={saveNotice}
            disabled={savingNotice || !noticeDirty}
            aria-label="Aydınlatma metnini kaydet"
          >
            {savingNotice ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </section>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !savingMode) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Asistan modu {pending ? `"${MODE_LABELS[pending]}"` : ""} olsun mu?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending ? MODE_DESCRIPTIONS[pending] : ""}
              {pending === "LIVE"
                ? " Dikkat: Elif'in yazdığı cevaplar doğrudan danışanlara gönderilir. Önce gölge moddaki taslakları incelemeniz önerilir."
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={savingMode}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMode} disabled={savingMode}>
              {savingMode ? "Kaydediliyor..." : "Onayla"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
