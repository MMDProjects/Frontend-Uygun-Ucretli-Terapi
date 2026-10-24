"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_LENGTH = 4096;

interface MessageComposerProps {
  botActive: boolean;
  onSend: (content: string) => Promise<void>;
}

export function MessageComposer({ botActive, onSend }: MessageComposerProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !sending;

  async function doSend() {
    if (!canSend) return;
    setSending(true);
    try {
      await onSend(trimmed);
      setValue("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mesaj gönderilemedi");
    } finally {
      setSending(false);
    }
  }

  function requestSend() {
    if (!canSend) return;
    if (botActive) {
      setConfirmOpen(true);
      return;
    }
    void doSend();
  }

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              requestSend();
            }
          }}
          rows={1}
          maxLength={MAX_LENGTH}
          placeholder="Mesajınızı yazın (Enter gönderir, Shift+Enter yeni satır)"
          aria-label="Mesaj"
          className="max-h-40 min-h-11 flex-1 resize-none rounded-xl px-3 py-2.5"
        />
        <Button
          type="button"
          size="icon"
          onClick={requestSend}
          disabled={!canSend}
          aria-label="Gönder"
          className="shrink-0"
        >
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konuşmayı devralıyorsunuz</AlertDialogTitle>
            <AlertDialogDescription>
              Bu konuşmayı devralacaksınız; Elif bu konuşmada susacak. Elif&apos;e
              konuşmayı daha sonra geri verebilirsiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                void doSend();
              }}
            >
              Devral ve gönder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
