"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getKvkkAdminContent,
  publishKvkkVersion,
  type KvkkActiveVersion,
  type KvkkVersionMeta,
} from "@/services/content/kvkk-content.service";
import type { KvkkSection } from "@/lib/services/public.service";
import { DEFAULT_KVKK_SECTIONS } from "@/lib/constants/kvkk-defaults";

export function KvkkContentView() {
  const [active, setActive] = useState<KvkkActiveVersion | null>(null);
  const [history, setHistory] = useState<KvkkVersionMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [draftVersion, setDraftVersion] = useState("");
  const [draftSections, setDraftSections] = useState<KvkkSection[]>([]);

  const lastLoaded = useRef<{ version: string; sections: KvkkSection[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKvkkAdminContent();
      if (data) {
        setActive(data.active);
        setHistory(data.history);
        const sections = data.active.sections.length ? data.active.sections : DEFAULT_KVKK_SECTIONS;
        setDraftVersion(data.active.version);
        setDraftSections(sections);
        lastLoaded.current = { version: data.active.version, sections };
      } else {
        setDraftVersion(new Date().toISOString().slice(0, 7));
        setDraftSections(DEFAULT_KVKK_SECTIONS);
        lastLoaded.current = null;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const isDirty = useMemo(() => {
    if (!lastLoaded.current) return draftSections.length > 0 || draftVersion.length > 0;
    return (
      draftVersion !== lastLoaded.current.version ||
      JSON.stringify(draftSections) !== JSON.stringify(lastLoaded.current.sections)
    );
  }, [draftVersion, draftSections]);

  const updateSection = (idx: number, field: "title" | "html", value: string) => {
    setDraftSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleReset = () => {
    if (!lastLoaded.current) return;
    setDraftVersion(lastLoaded.current.version);
    setDraftSections(lastLoaded.current.sections);
    toast.info("Son yayınlanan versiyona sıfırlandı.");
  };

  const handlePublish = async () => {
    if (!draftVersion.trim()) {
      toast.error("Versiyon adı boş bırakılamaz.");
      return;
    }
    setSaving(true);
    try {
      const result = await publishKvkkVersion(draftVersion.trim(), draftSections);
      toast.success(result.message ?? "Yeni KVKK versiyonu yayınlandı.");
      lastLoaded.current = { version: draftVersion.trim(), sections: draftSections };
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yayınlama başarısız.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="KVKK Aydınlatma Metni"
        description="Her yayınlama yeni bir versiyon oluşturur. Form onayları hangi versiyonu gördüklerine göre kayıt altına alınır."
      />

      {/* Aktif versiyon bilgisi */}
      {active?.id && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-primary/5 px-4 py-2.5 text-sm">
          <span className="size-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">
            Aktif versiyon:&nbsp;
            <span className="font-medium text-foreground">{active.version}</span>
            {active.publishedAt && (
              <>&nbsp;— {new Date(active.publishedAt).toLocaleDateString("tr-TR")}</>
            )}
          </span>
        </div>
      )}

      <Card className="rounded-lg border border-border shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <CardContent className="space-y-6 pt-6">
          {loading ? (
            <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Yükleniyor...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button type="button" variant="outline" className="mt-3" onClick={() => void load()}>
                Tekrar dene
              </Button>
            </div>
          ) : (
            <>
              {/* Versiyon etiketi */}
              <div className="space-y-2">
                <Label htmlFor="kvkk-version">
                  Versiyon Etiketi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="kvkk-version"
                  value={draftVersion}
                  onChange={(e) => setDraftVersion(e.target.value)}
                  placeholder="Örn. 2026-06"
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Yayınlama sırasında değiştirirseniz yeni bir versiyon oluşur.
                </p>
              </div>

              {/* Bölümler */}
              <div className="space-y-4">
                <p className="text-sm font-medium">Bölümler</p>
                {draftSections.map((section, idx) => (
                  <div key={section.id} className="rounded-md border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Bölüm {idx + 1} — <code className="text-primary">{section.id}</code>
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Başlık</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(idx, "title", e.target.value)}
                        placeholder="Bölüm başlığı"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">İçerik (HTML)</Label>
                      <Textarea
                        value={section.html}
                        onChange={(e) => updateSection(idx, "html", e.target.value)}
                        rows={5}
                        className="font-mono text-xs"
                        placeholder="<p>...</p>"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Aksiyon butonları */}
              <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!isDirty || saving}
                >
                  Sıfırla
                </Button>
                <Button
                  type="button"
                  onClick={() => void handlePublish()}
                  disabled={saving || !isDirty}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Yayınlanıyor...
                    </>
                  ) : (
                    "Yeni Versiyon Yayınla"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Versiyon geçmişi */}
      {history.length > 0 && (
        <Card className="rounded-lg border border-border shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
          <CardContent className="pt-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-sm font-medium text-foreground"
              onClick={() => setHistoryOpen((o) => !o)}
            >
              <span className="flex items-center gap-2">
                <History className="size-4 text-muted-foreground" />
                Versiyon Geçmişi ({history.length})
              </span>
              {historyOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {historyOpen && (
              <div className="mt-4 divide-y divide-border rounded-md border border-border">
                {history.map((v) => (
                  <div key={v.id} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      {v.isActive && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                          Aktif
                        </span>
                      )}
                      <span className="font-medium">{v.version}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(v.publishedAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
