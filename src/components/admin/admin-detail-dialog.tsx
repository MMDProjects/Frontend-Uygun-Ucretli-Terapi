"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ADMIN_ROLE_LABELS } from "@/lib/admin-user-meta";
import type { AdminUser } from "@/types/dto/admin-user-list";

interface AdminDetailDialogProps {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminDetailDialog({
  user,
  open,
  onOpenChange,
}: AdminDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user.fullName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">ID</span>
            <span className="font-medium">{user.id}</span>
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">E-posta</span>
            <span className="text-right font-medium">{user.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Yetki tipi</span>
            <span className="font-medium">{ADMIN_ROLE_LABELS[user.role]}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Durum</span>
            <span className="font-medium">
              {user.status === "active" ? "Aktif" : "Pasif"}
            </span>
          </div>
          {user.createdAt ? (
            <>
              <Separator />
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Oluşturulma</span>
                <span className="font-medium tabular-nums">{user.createdAt}</span>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
