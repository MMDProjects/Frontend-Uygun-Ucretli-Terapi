"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/features/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

type ExpertItem = { id: string; user: { firstName: string; lastName: string } };

const schema = z.object({
  userId: z.string().uuid("Geçerli bir uzman seçin."),
  type: z.enum(["INFO", "WARNING", "DANGER_PANIC"]),
  message: z.string().min(5, "Mesaj en az 5 karakter olmalıdır.").max(500, "En fazla 500 karakter."),
});

type FormValues = z.infer<typeof schema>;

export default function AdminBildirimlerPage() {
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "INFO" },
  });

  useEffect(() => {
    const token = getAccessToken();
    apiFetch<{ data: ExpertItem[] }>("/admin/experts?limit=200", { token })
      .then((res) => setExperts(res.data ?? []))
      .catch(() => setExperts([]))
      .finally(() => setLoadingExperts(false));
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      const token = getAccessToken();
      await apiFetch("/admin/notifications", {
        method: "POST",
        body: values,
        token,
      });
      toast.success("Bildirim gönderildi.");
      reset({ type: "INFO", message: "", userId: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bildirim gönderilemedi.");
    }
  }

  const typeLabels: Record<string, string> = {
    INFO: "Bilgi",
    WARNING: "Uyarı",
    DANGER_PANIC: "Acil Uyarı",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bildirim Gönder"
        description="Bir uzmana bildirim veya uyarı mesajı gönderin."
      />

      <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Uzman seçimi */}
          <div className="space-y-1.5">
            <Label>Uzman <span className="text-destructive">*</span></Label>
            {loadingExperts ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Uzmanlar yükleniyor…
              </div>
            ) : (
              <Select
                value={watch("userId") ?? ""}
                onValueChange={(v) => { if (v) setValue("userId", v, { shouldValidate: true }); }}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Uzman seçin…" />
                </SelectTrigger>
                <SelectContent>
                  {experts.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.user.firstName} {e.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
          </div>

          {/* Bildirim tipi */}
          <div className="space-y-1.5">
            <Label>Bildirim Tipi <span className="text-destructive">*</span></Label>
            <Select
              value={watch("type")}
              onValueChange={(v) => { if (v) setValue("type", v as FormValues["type"], { shouldValidate: true }); }}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mesaj */}
          <div className="space-y-1.5">
            <Label htmlFor="message">Mesaj <span className="text-destructive">*</span></Label>
            <Textarea
              id="message"
              placeholder="Uzmana iletmek istediğiniz mesajı yazın…"
              rows={4}
              className="rounded-xl resize-none"
              {...register("message")}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <><Loader2 className="mr-2 size-4 animate-spin" />Gönderiliyor…</>
            ) : (
              <><Send className="mr-2 size-4" />Bildirimi Gönder</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
