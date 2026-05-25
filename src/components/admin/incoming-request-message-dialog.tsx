"use client";

import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INCOMING_STATUS_LABELS } from "@/lib/incoming-request-meta";
import type { IncomingRequest } from "@/types/dto/incoming-request";

function formatCreatedAt(iso: string): string {
  try {
    return format(parseISO(iso), "d MMMM yyyy, HH:mm", { locale: tr });
  } catch {
    return iso;
  }
}

interface IncomingRequestMessageDialogProps {
  request: IncomingRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IncomingRequestMessageDialog({
  request,
  open,
  onOpenChange,
}: IncomingRequestMessageDialogProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Mesaj</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-foreground">{request.fullName}</span>
            <span className="text-muted-foreground"> · {request.email}</span>
          </div>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Konu:</span>{" "}
            {request.subject}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Tarih:</span>{" "}
            {formatCreatedAt(request.createdAt)}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Durum:</span>{" "}
            {INCOMING_STATUS_LABELS[request.status]}
          </p>
          <div className="rounded-md border bg-muted/30 p-3 whitespace-pre-wrap text-foreground">
            {request.message}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="transition-colors hover:bg-muted/80 active:scale-[0.98]"
            onClick={() => onOpenChange(false)}
          >
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
