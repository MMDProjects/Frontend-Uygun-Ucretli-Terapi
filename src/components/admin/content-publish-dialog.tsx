"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentPublishForm } from "@/components/admin/content-publish-form";

export interface ContentPublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContentPublishDialog({
  open,
  onOpenChange,
}: ContentPublishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-[95vw] overflow-y-auto p-4 sm:max-w-[600px] sm:p-6 md:max-w-[650px] md:h-[80vh] lg:max-w-[900px] xl:max-w-[1100px]">
        <DialogHeader className="mb-4 md:mb-6">
          <DialogTitle className="text-lg font-semibold md:text-xl">
            İçerik yayınla
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Oluşturduğunuz içerik, onaylandıktan sonra kullanıcılar tarafından
            görüntülenebilecek.
          </DialogDescription>
        </DialogHeader>
        <ContentPublishForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
