"use client";

import { useEffect, useRef, useState } from "react";
import { format, startOfToday } from "date-fns";
import { tr as trFns } from "date-fns/locale";
import { tr as trDayPicker } from "react-day-picker/locale";
import { CalendarIcon, Clock, MapPin, Timer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitContentPublish } from "@/services/content/content-publish.service";
import { cn } from "@/lib/utils";

const CONTENT_CATEGORIES = [
  { id: "makale", label: "Makale", value: "makale" },
  { id: "duyuru", label: "Duyuru", value: "duyuru" },
  { id: "video", label: "Video", value: "video" },
  { id: "podcast", label: "Podcast", value: "podcast" },
  { id: "webinar", label: "Webinar / canlı", value: "webinar" },
  { id: "rehber", label: "Rehber / infografik", value: "rehber" },
] as const;

export interface ContentPublishFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  /** Use plain footer layout (e.g. inside Card) instead of dialog chrome. */
  embedInPage?: boolean;
}

export function ContentPublishForm({
  onSuccess,
  onCancel,
  className,
  embedInPage = false,
}: ContentPublishFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null as Date | null,
    time: "",
    channel: "",
    category: "" as string,
    categoryId: "" as string,
    durationDays: 7,
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const datePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!datePickerOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = datePanelRef.current;
      if (el && !el.contains(e.target as Node)) {
        setDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [datePickerOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: null,
      time: "",
      channel: "",
      category: "",
      categoryId: "",
      durationDays: 7,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.channel ||
      !formData.category
    ) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    const duration = Number(formData.durationDays);
    if (Number.isNaN(duration) || duration < 1) {
      toast.error("Yayın süresi en az 1 gün olmalıdır");
      return;
    }

    setLoading(true);
    try {
      const publishDate = format(formData.date, "yyyy-MM-dd");
      const res = await submitContentPublish({
        title: formData.title,
        description: formData.description,
        publishDate,
        publishTime: formData.time,
        channel: formData.channel,
        categoryId: formData.categoryId,
        categoryLabel: formData.category,
        durationDays: duration,
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      resetForm();
      onSuccess?.();
    } catch {
      toast.error("İçerik gönderilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  const today = startOfToday();

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4 md:space-y-6", className)}
    >
      <div className="space-y-2 md:space-y-4">
        <Label htmlFor="content-title" className="text-sm font-medium md:text-base">
          İçerik başlığı *
        </Label>
        <Input
          id="content-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Örn: Uyku hijyeni üzerine kısa rehber"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2 md:space-y-4">
        <Label
          htmlFor="content-description"
          className="text-sm font-medium md:text-base"
        >
          İçerik özeti / açıklama *
        </Label>
        <Textarea
          id="content-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Yayınlanacak içerik hakkında detay verin"
          className="min-h-[100px] w-full resize-none md:min-h-[150px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-date" className="text-sm font-medium md:text-base">
            Yayın tarihi *
          </Label>
          <div className="relative" ref={datePanelRef}>
            <div className="flex">
              <div className="relative flex-grow">
                <Input
                  id="content-date"
                  name="date"
                  value={
                    formData.date
                      ? format(formData.date, "dd.MM.yyyy", { locale: trFns })
                      : ""
                  }
                  readOnly
                  placeholder="Tarih seçin"
                  className="w-full cursor-pointer pl-10"
                  onClick={() => setDatePickerOpen(true)}
                />
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setDatePickerOpen((o) => !o)}
                className="ml-1 shrink-0"
                aria-label="Takvimi aç"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>

            {datePickerOpen ? (
              <div className="absolute top-full left-0 z-50 mt-2 w-[min(100%,320px)] rounded-md border border-border bg-popover p-2 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Tarih seçin</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDatePickerOpen(false)}
                    className="h-7 w-7 rounded-full"
                    aria-label="Kapat"
                  >
                    ✕
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={formData.date ?? undefined}
                  onSelect={(date) => {
                    if (date) setFormData((prev) => ({ ...prev, date }));
                  }}
                  disabled={(date) => date < today}
                  locale={trDayPicker}
                />
                <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePickerOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (formData.date) setDatePickerOpen(false);
                      else toast.error("Lütfen bir tarih seçin");
                    }}
                  >
                    Seç
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content-time" className="text-sm font-medium md:text-base">
            Saat *
          </Label>
          <div className="relative flex items-center">
            <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="content-time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 md:space-y-4">
        <Label htmlFor="content-channel" className="text-sm font-medium md:text-base">
          Yayın yeri veya kanal *
        </Label>
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="content-channel"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            placeholder="Örn: Blog, uygulama ana sayfası, e-posta bülteni"
            className="w-full pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-category" className="text-sm font-medium md:text-base">
            İçerik kategorisi *
          </Label>
          <Select
            value={formData.categoryId || null}
            onValueChange={(value) => {
              const row = CONTENT_CATEGORIES.find((c) => c.id === value);
              setFormData((prev) => ({
                ...prev,
                categoryId: value ?? "",
                category: row?.label ?? "",
              }));
            }}
          >
            <SelectTrigger id="content-category" className="w-full min-w-0">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="content-duration"
            className="text-sm font-medium md:text-base"
          >
            Yayın süresi (gün) *
          </Label>
          <div className="relative flex items-center">
            <Timer className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="content-duration"
              name="durationDays"
              type="number"
              min={1}
              max={365}
              value={formData.durationDays}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  durationDays: Number(e.target.value) || 0,
                }))
              }
              className="w-full pl-10"
              required
            />
          </div>
        </div>
      </div>

      {embedInPage ? (
        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            İptal
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Gönderiliyor…" : "Yayınla"}
          </Button>
        </div>
      ) : (
        <DialogFooter className="mt-6 sm:mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            İptal
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Gönderiliyor…" : "Yayınla"}
          </Button>
        </DialogFooter>
      )}
    </form>
  );
}
