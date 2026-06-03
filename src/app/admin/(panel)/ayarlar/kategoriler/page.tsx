"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Tag } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

type ApiTag = { id: string; name: string; isActive: boolean };

export default function AyarlarKategorilerPage() {
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    setLoading(true);
    try {
      const token = getAccessToken();
      const data = await apiFetch<ApiTag[]>("/admin/tags", { token });
      setTags(data);
    } catch {
      toast.error("Etiketler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const token = getAccessToken();
      const created = await apiFetch<ApiTag>("/admin/tags", {
        method: "POST",
        token,
        body: { name },
      });
      setTags((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, "tr")));
      setNewName("");
      toast.success("Etiket eklendi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Etiket eklenemedi.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(tag: ApiTag) {
    try {
      const token = getAccessToken();
      await apiFetch(`/admin/tags/${tag.id}`, {
        method: "PATCH",
        token,
        body: { isActive: !tag.isActive },
      });
      setTags((prev) => prev.map((t) => t.id === tag.id ? { ...t, isActive: !t.isActive } : t));
    } catch {
      toast.error("Durum güncellenemedi.");
    }
  }

  async function handleDelete(tag: ApiTag) {
    if (!confirm(`"${tag.name}" etiketini silmek istediğinize emin misiniz? Bu etiketi kullanan uzman profillerinden de kaldırılacaktır.`)) return;
    try {
      const token = getAccessToken();
      await apiFetch(`/admin/tags/${tag.id}`, { method: "DELETE", token });
      setTags((prev) => prev.filter((t) => t.id !== tag.id));
      toast.success("Etiket silindi.");
    } catch {
      toast.error("Etiket silinemedi.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Etiket Yönetimi"
        description="Uzman profillerinde kullanılan uzmanlık etiketlerini yönetin."
      />

      <Card>
        <CardContent className="pt-6">
          <div className="mb-5 flex items-center gap-2">
            <Tag className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-primary-hover">Yeni Etiket Ekle</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
              placeholder="Etiket adı..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {adding ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Plus className="size-4" />
              )}
              Ekle
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-primary-hover">Mevcut Etiketler</h2>
            </div>
            <span className="text-xs text-muted-foreground">{tags.length} etiket</span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : tags.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Henüz etiket yok.</p>
          ) : (
            <div className="space-y-1.5">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-4 py-2.5 transition",
                    tag.isActive
                      ? "border-border bg-background"
                      : "border-border/40 bg-muted/30 opacity-60",
                  ].join(" ")}
                >
                  <span className="flex-1 text-sm font-medium text-foreground">{tag.name}</span>

                  <button
                    type="button"
                    onClick={() => handleToggle(tag)}
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold transition",
                      tag.isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20",
                    ].join(" ")}
                  >
                    {tag.isActive ? "Aktif" : "Pasif"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(tag)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition hover:border-destructive/30 hover:text-destructive"
                    aria-label={`${tag.name} etiketini sil`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
