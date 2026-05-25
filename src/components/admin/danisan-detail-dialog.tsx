"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { DanisanUser } from "@/types/dto/user-list";
import { ROLE_LABELS } from "@/lib/danisan-user-meta";

interface DanisanDetailDialogProps {
  user: DanisanUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DanisanDetailDialog({
  user,
  open,
  onOpenChange,
}: DanisanDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>Danışan özeti</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">E-posta</span>
            <span className="text-right font-medium">{user.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Rol</span>
            <span className="font-medium">{ROLE_LABELS[user.role]}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Durum</span>
            <span className="font-medium">
              {user.status === "active" ? "Aktif" : "Pasif"}
            </span>
          </div>
          {user.registeredAt ? (
            <>
              <Separator />
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Kayıt</span>
                <span className="font-medium tabular-nums">{user.registeredAt}</span>
              </div>
            </>
          ) : null}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Link
            href={`/formlar/talepler?danisan=${encodeURIComponent(user.id)}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full justify-center"
            )}
          >
            Talepleri görüntüle
          </Link>
          <p className="text-center text-xs text-muted-foreground">
            Talep listesi filtresi backend hazır olduğunda uygulanır.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
