"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/auth-cookies";
import { getOptionalApiBase } from "@/lib/http-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/features/admin/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  saveTest,
  type SavePsychometricTestPayload,
} from "@/services/tests/psychometric-tests.service";
import { PsychometricInterpretationBandsEditor } from "./psychometric-interpretation-bands-editor";
import { PsychometricQuestionsEditor } from "./psychometric-questions-editor";
import { PsychometricSubscalesEditor } from "./psychometric-subscales-editor";

function emptyForm(): SavePsychometricTestPayload {
  return {
    title: "",
    description: "",
    disclaimer: "",
    subscales: [],
    interpretationBands: [],
    questions: [],
  };
}

export function PsychometricTestBuilderView({ hideHeader }: { hideHeader?: boolean } = {}) {
  const router = useRouter();
  const [form, setForm] = useState<SavePsychometricTestPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const validate = (): string | null => {
    if (!form.title.trim()) return "Test başlığı zorunludur.";
    if (form.questions.length === 0) return "En az bir soru ekleyin.";
    for (const q of form.questions) {
      if (!q.text.trim()) return `Soru ${q.order} metni boş olamaz.`;
      if (q.options.length < 2) {
        return `Soru ${q.order} için en az iki şık önerilir.`;
      }
      if (q.options.some((o) => !o.label.trim())) {
        return `Soru ${q.order}: tüm şık etiketleri dolu olmalıdır.`;
      }
    }
    if (form.interpretationBands.length === 0) {
      return "En az bir yorum bandı ekleyin (toplam puan aralıkları).";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      const token = getAccessToken();
      await saveTest(form, token ?? null);
      const api = getOptionalApiBase();
      toast.success(
        api
          ? "Test kaydedildi"
          : "Test kaydedildi (bellek içi; sayfa yenilenince örnek verilerle sıfırlanabilir)"
      );
      setForm(emptyForm());
      router.push("/formlar/testler");
    } catch (errUnknown) {
      toast.error(
        errUnknown instanceof Error ? errUnknown.message : "Kayıt başarısız"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 space-y-6">
      {!hideHeader && (
        <PageHeader
          title="Test oluşturucu"
          description="Soru başına şıkları ve puanları tanımlayın; alt ölçek ve yorum bantları isteğe bağlıdır."
        />
      )}

      <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardHeader>
          <CardTitle>Genel bilgi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pt-title">Test başlığı</Label>
            <Input
              id="pt-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Örn. MOCI — tarama formu"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pt-desc">Açıklama</Label>
            <Textarea
              id="pt-desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Testin amacı ve kullanımı"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pt-disclaimer">Uyarı / sorumluluk metni</Label>
            <Textarea
              id="pt-disclaimer"
              value={form.disclaimer ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, disclaimer: e.target.value }))
              }
              placeholder="Tanı koymaz; klinik değerlendirme önerisi vb."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardContent className="pt-6">
          <PsychometricSubscalesEditor
            subscales={form.subscales}
            onChange={(subscales) => setForm((f) => ({ ...f, subscales }))}
          />
        </CardContent>
      </Card>

      <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardContent className="pt-6">
          <PsychometricInterpretationBandsEditor
            bands={form.interpretationBands}
            onChange={(interpretationBands) =>
              setForm((f) => ({ ...f, interpretationBands }))
            }
          />
        </CardContent>
      </Card>

      <Card className="shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardContent className="pt-6">
          <PsychometricQuestionsEditor
            questions={form.questions}
            subscales={form.subscales}
            onChange={(questions) => setForm((f) => ({ ...f, questions }))}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="min-w-[140px] transition-colors hover:opacity-95 active:scale-[0.98]"
        >
          {saving ? "Kaydediliyor…" : "Testi kaydet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setForm(emptyForm())}
          disabled={saving}
          className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
        >
          Formu temizle
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        API adresi tanımlı değilken kayıtlar yalnızca bu oturum belleğinde tutulur;
        üretimde `GET/POST/PATCH /admin/psychometric-tests` ile kalıcı hale
        getirilebilir.
      </p>
    </form>
  );
}
