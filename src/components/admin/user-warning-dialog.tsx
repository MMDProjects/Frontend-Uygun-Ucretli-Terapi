"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NotifType = "INFO" | "WARNING" | "DANGER_PANIC";

const TYPE_OPTIONS: { value: NotifType; label: string; description: string; className: string }[] = [
  {
    value: "INFO",
    label: "Bilgi",
    description: "Genel bilgilendirme mesajı",
    className: "border-blue-300 bg-blue-50 text-blue-700",
  },
  {
    value: "WARNING",
    label: "Uyarı",
    description: "Dikkat gerektiren durum",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  {
    value: "DANGER_PANIC",
    label: "ACİL",
    description: "Tam ekran kırmızı popup olarak gösterilir",
    className: "border-red-400 bg-red-50 text-red-700",
  },
];

interface UserWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  recipientKind?: string;
  onSendWarning: (message: string, type: NotifType) => void;
}

export function UserWarningDialog({
  open,
  onOpenChange,
  userName,
  recipientKind = "danışana",
  onSendWarning,
}: UserWarningDialogProps) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotifType>("INFO");

  const handleSend = () => {
    if (message.trim()) {
      onSendWarning(message, type);
      setMessage("");
      setType("INFO");
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) { setMessage(""); setType("INFO"); }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Bildirim gönder: {userName}</DialogTitle>
          <DialogDescription>
            {userName} adlı {recipientKind} gönderilecek bildirimi yazın.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Tip Seçimi */}
          <div className="space-y-2">
            <Label>Bildirim Tipi</Label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center text-xs font-semibold transition",
                    type === opt.value ? opt.className + " border-opacity-100" : "border-border bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="text-sm">{opt.label}</span>
                  <span className="font-normal leading-relaxed opacity-80">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mesaj */}
          <div className="space-y-2">
            <Label htmlFor="warning-body">Mesaj</Label>
            <Textarea
              id="warning-body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={type === "DANGER_PANIC" ? "Acil durum mesajını yazın…" : "Kısa ve net bir mesaj…"}
              rows={4}
            />
            {type === "DANGER_PANIC" && (
              <p className="text-xs font-medium text-red-600">
                ⚠ Bu bildirim uzmanın ekranında tam ekran kırmızı popup olarak gösterilir.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Vazgeç
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className={type === "DANGER_PANIC" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Gönder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
