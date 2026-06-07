"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAdminPackages,
  updateAdminPackage,
  type AdminPackage,
} from "@/services/admin/packages.service";

function parseItems(description: string): string[] {
  const lines = description
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : [""];
}

function serializeItems(items: string[]): string {
  return items
    .map((i) => i.trim())
    .filter(Boolean)
    .map((i) => `- ${i}`)
    .join("\n");
}

function PackageEditor({
  pkg,
  order,
  isPopular,
  onSaved,
}: {
  pkg: AdminPackage;
  order: number;
  isPopular: boolean;
  onSaved: (updated: AdminPackage) => void;
}) {
  const [name, setName] = useState(pkg.name);
  const [sessionCount, setSessionCount] = useState(String(pkg.sessionCount));
  const [price, setPrice] = useState(String(Number(pkg.price)));
  const [items, setItems] = useState<string[]>(() => parseItems(pkg.description));
  const [saving, setSaving] = useState(false);

  function updateItem(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, ""]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    const description = serializeItems(items);
    try {
      await updateAdminPackage(pkg.id, {
        name,
        sessionCount: Number(sessionCount),
        price: Number(price),
        description,
      });
      toast.success(`"${name}" paketi güncellendi`);
      onSaved({
        ...pkg,
        name,
        sessionCount: Number(sessionCount),
        price: String(Number(price)),
        description,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{pkg.name}</CardTitle>
          <div className="flex items-center gap-1.5">
            {isPopular && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                En Popüler
              </span>
            )}
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {order}. Sıra
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Paket Adı</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Seans Sayısı</Label>
            <Input
              type="number"
              min={1}
              value={sessionCount}
              onChange={(e) => setSessionCount(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Fiyat (TL)</Label>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">
            Madde Listesi
            <span className="ml-1.5 font-normal text-muted-foreground">
              ({items.filter(Boolean).length} madde)
            </span>
          </Label>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="shrink-0 size-1.5 rounded-full bg-primary/40 mt-0.5" />
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`Madde ${index + 1}`}
                  className="h-9 flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                  className="shrink-0 flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Maddeyi sil"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-medium transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            Madde Ekle
          </button>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Kaydediliyor…
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPaketlerPage() {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminPackages()
      .then(setPackages)
      .catch(() => toast.error("Paketler yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(updated: AdminPackage) {
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket Yönetimi"
        description="Paket adlarını, fiyatlarını ve içerik maddelerini düzenleyin. Değişiklikler /paketler sayfasına anında yansır."
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg, i) => (
            <PackageEditor
              key={pkg.id}
              pkg={pkg}
              order={i + 1}
              isPopular={i === Math.floor(packages.length / 2)}
              onSaved={handleSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
}
