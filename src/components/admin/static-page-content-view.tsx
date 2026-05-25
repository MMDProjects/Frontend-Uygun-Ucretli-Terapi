"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStaticPageContent } from "@/hooks/use-static-page-content";
import { PageHeader } from "@/features/admin/components/page-header";
import type {
  StaticExtraSection,
  StaticPageContent,
} from "@/types/dto/static-page-content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function normalizeSections(list: StaticExtraSection[]): StaticExtraSection[] {
  return list
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item, idx) => ({ ...item, order: idx }));
}

export function StaticPageContentView() {
  const { content, loading, saving, error, refetch, save } =
    useStaticPageContent();

  const [form, setForm] = useState<StaticPageContent>({
    about: "",
    vision: "",
    mission: "",
    extraSections: [],
  });
  const [lastLoaded, setLastLoaded] = useState<StaticPageContent | null>(null);

  useEffect(() => {
    if (!content) return;
    const normalized: StaticPageContent = {
      ...content,
      extraSections: normalizeSections(content.extraSections),
    };
    setForm(normalized);
    setLastLoaded(normalized);
  }, [content]);

  const isDirty = useMemo(() => {
    if (!lastLoaded) return false;
    return JSON.stringify(form) !== JSON.stringify(lastLoaded);
  }, [form, lastLoaded]);

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      extraSections: [
        ...prev.extraSections,
        {
          id: crypto.randomUUID(),
          title: "",
          body: "",
          order: prev.extraSections.length,
        },
      ],
    }));
  };

  const removeSection = (id: string) => {
    setForm((prev) => ({
      ...prev,
      extraSections: normalizeSections(
        prev.extraSections.filter((item) => item.id !== id)
      ),
    }));
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    setForm((prev) => {
      const list = normalizeSections(prev.extraSections);
      const index = list.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= list.length) return prev;
      const swapped = list.slice();
      const current = swapped[index];
      swapped[index] = swapped[nextIndex];
      swapped[nextIndex] = current;
      return {
        ...prev,
        extraSections: normalizeSections(swapped),
      };
    });
  };

  const updateSectionField = (
    id: string,
    field: "title" | "body",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      extraSections: prev.extraSections.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleReset = () => {
    if (!lastLoaded) return;
    setForm(lastLoaded);
    toast.info("Alanlar son yüklenen veriye sıfırlandı.");
  };

  const handleSave = async () => {
    const payload: StaticPageContent = {
      ...form,
      extraSections: normalizeSections(form.extraSections),
    };
    try {
      const message = await save(payload);
      toast.success(message);
      setLastLoaded(payload);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kaydetme başarısız");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sayfa içerikleri"
        description="Hakkımızda, vizyon, misyon ve ek blokları bu ekrandan güncelleyebilirsiniz."
      />
      <Card className="rounded-lg border border-border shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <CardContent className="space-y-6 pt-6">
          {loading ? (
            <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              İçerik yükleniyor...
            </div>
          ) : null}

          {error && !loading ? (
            <div className="rounded-lg border border-[#EB5757]/30 bg-[#EB5757]/5 p-4">
              <p className="text-sm text-[#EB5757]">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => void refetch()}
              >
                Tekrar dene
              </Button>
            </div>
          ) : null}

          {!loading ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="about">Hakkımızda</Label>
                <Textarea
                  id="about"
                  value={form.about}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, about: e.target.value }))
                  }
                  rows={5}
                  placeholder="Hakkımızda metnini girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Vizyonumuz</Label>
                <Textarea
                  id="vision"
                  value={form.vision}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, vision: e.target.value }))
                  }
                  rows={4}
                  placeholder="Vizyon metnini girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Misyonumuz</Label>
                <Textarea
                  id="mission"
                  value={form.mission}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, mission: e.target.value }))
                  }
                  rows={4}
                  placeholder="Misyon metnini girin"
                />
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">Ek bloklar</h3>
                    <p className="text-xs text-muted-foreground">
                      İstediğiniz kadar ek bölüm ekleyebilir, silebilir ve
                      sıralayabilirsiniz.
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addSection}>
                    <Plus className="mr-1 size-4" />
                    Blok ekle
                  </Button>
                </div>

                <div className="space-y-3">
                  {form.extraSections.map((section, index) => (
                    <div key={section.id} className="rounded-md border p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Ek Blok #{index + 1}
                        </p>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => moveSection(section.id, "up")}
                            disabled={index === 0}
                          >
                            <MoveUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => moveSection(section.id, "down")}
                            disabled={index === form.extraSections.length - 1}
                          >
                            <MoveDown className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeSection(section.id)}
                            className="text-[#EB5757] hover:text-[#EB5757]"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={section.title}
                          onChange={(e) =>
                            updateSectionField(section.id, "title", e.target.value)
                          }
                          placeholder="Blok başlığı"
                        />
                        <Textarea
                          value={section.body}
                          onChange={(e) =>
                            updateSectionField(section.id, "body", e.target.value)
                          }
                          rows={3}
                          placeholder="Blok içeriği"
                        />
                      </div>
                    </div>
                  ))}
                  {form.extraSections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Henüz ek blok yok.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!isDirty || saving}
                >
                  Sıfırla
                </Button>
                <Button type="button" onClick={() => void handleSave()} disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
