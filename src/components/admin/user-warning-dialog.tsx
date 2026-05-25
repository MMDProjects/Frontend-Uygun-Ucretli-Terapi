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

interface UserWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  /** e.g. "danışana", "uzmana" — inserted after the name in the description. */
  recipientKind?: string;
  onSendWarning: (message: string) => void;
}

export function UserWarningDialog({
  open,
  onOpenChange,
  userName,
  recipientKind = "danışana",
  onSendWarning,
}: UserWarningDialogProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendWarning(message);
      setMessage("");
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setMessage("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Uyarı gönder: {userName}</DialogTitle>
          <DialogDescription>
            {userName} adlı {recipientKind} gönderilecek uyarı metnini yazın. E-posta veya
            uygulama bildirimi backend ile bağlandığında iletilecek.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="warning-body">Mesaj</Label>
          <Textarea
            id="warning-body"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Kısa ve net bir uyarı metni…"
            rows={4}
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Vazgeç
          </Button>
          <Button type="button" onClick={handleSend} disabled={!message.trim()}>
            Gönder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
