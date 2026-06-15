"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCheck, Clock } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { useAdminNotificationStore } from "@/lib/stores/admin-notification-store";
import { getAllAdminNotifications, markAllAdminNotificationsRead } from "@/lib/services/admin.service";

type ExpertItem = { id: string; user: { id: string; firstName: string; lastName: string } | null };

const schema = z.object({
  userId: z.string().uuid("Geçerli bir uzman seçin."),
  type: z.enum(["INFO", "WARNING", "DANGER_PANIC"]),
  message: z.string().min(5, "Mesaj en az 5 karakter olmalıdır.").max(500, "En fazla 500 karakter."),
});

type FormValues = z.infer<typeof schema>;

export default function AdminBildirimlerPage() {
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const { notifications, loadNotifications, markAllAsRead } = useAdminNotificationStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "INFO", userId: "", message: "" },
  });

  // Load experts
  useEffect(() => {
    apiFetch<{ data: ExpertItem[] }>("/admin/experts?limit=200")
      .then((res) => setExperts((res.data ?? []).filter((e) => e.user?.id)))
      .catch(() => setExperts([]))
      .finally(() => setLoadingExperts(false));
  }, []);

  // Load admin's own notifications
  useEffect(() => {
    const token = getAccessToken();
    getAllAdminNotifications(100)
      .then((notifs) => loadNotifications(notifs))
      .catch(() => {})
      .finally(() => setLoadingNotifications(false));
  }, [loadNotifications]);

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

  async function handleMarkAllRead() {
    try {
      await markAllAdminNotificationsRead();
      markAllAsRead();
      toast.success("Tüm bildirimler okundu olarak işaretlendi.");
    } catch (err: unknown) {
      toast.error("İşlem başarısız oldu.");
    }
  }

  const typeLabels: Record<string, string> = {
    INFO: "Bilgi",
    WARNING: "Uyarı",
    DANGER_PANIC: "Acil Uyarı",
  };

  const typeColors: Record<string, string> = {
    INFO: "bg-blue-50 border-blue-200",
    WARNING: "bg-amber-50 border-amber-200",
    DANGER_PANIC: "bg-red-50 border-red-200",
  };

  const typeIcons: Record<string, React.ReactNode> = {
    INFO: <Clock className="size-4 text-blue-600" />,
    WARNING: <Clock className="size-4 text-amber-600" />,
    DANGER_PANIC: <Clock className="size-4 text-red-600" />,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bildirimler"
        description="Bildirimleri gönder ve al."
      />

      <Tabs defaultValue="gelen" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="gelen">Gelen</TabsTrigger>
          <TabsTrigger value="gonder">Gönder</TabsTrigger>
        </TabsList>

        {/* Gelen Tab */}
        <TabsContent value="gelen" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            {loadingNotifications ? (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Bildirimler yükleniyor…
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Henüz bildirim yok.
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {notifications.filter((n) => !n.isRead).length} okunmamış bildirim
                  </p>
                  {notifications.some((n) => !n.isRead) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllRead}
                      className="h-8 text-xs"
                    >
                      <CheckCheck className="mr-1 size-3" />
                      Tümünü Okundu İşaretle
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`rounded-lg border-l-4 p-4 ${typeColors[notif.type] || "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        {typeIcons[notif.type]}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {typeLabels[notif.type]}
                            </p>
                            {!notif.isRead && (
                              <span className="inline-block size-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-foreground line-clamp-3">
                            {notif.message}
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {new Date(notif.createdAt).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Gönder Tab */}
        <TabsContent value="gonder">
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
                  <Controller
                    control={control}
                    name="userId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(v) => { if (v) field.onChange(v); }}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Uzman seçin…" />
                        </SelectTrigger>
                        <SelectContent>
                          {experts.filter((e) => e.user?.id).map((e) => (
                            <SelectItem key={e.id} value={e.user!.id}>
                              {e.user!.firstName} {e.user!.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
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

              <Button type="submit" disabled={isSubmitting || experts.filter((e) => e.user?.id).length === 0} className="w-full">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />Gönderiliyor…</>
                ) : (
                  <><Send className="mr-2 size-4" />Bildirimi Gönder</>
                )}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
