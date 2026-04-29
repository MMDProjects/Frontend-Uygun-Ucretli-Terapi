"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { X, MessageCircle, Star, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";

export function FreeConsultationPopup() {
  const { isAuthenticated, hasSeenFreeConsultPopup, markFreeConsultSeen } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasSeenFreeConsultPopup) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasSeenFreeConsultPopup]);

  function handleClose() {
    setOpen(false);
    markFreeConsultSeen();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/80 bg-white p-0 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-lg"
          aria-describedby="free-consult-desc"
        >
          {/* Üst bant */}
          <div className="relative overflow-hidden rounded-t-3xl bg-primary px-6 pb-8 pt-7">
            <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/10" />

            <Dialog.Close asChild>
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                aria-label="Kapat"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                <Star className="size-3 fill-white" />
                Hoş geldiniz!
              </span>
              <Dialog.Title className="mt-3 text-2xl font-bold leading-tight text-white">
                Ücretsiz Ön Görüşme
                <br />
                Hakkınız Hazır
              </Dialog.Title>
              <p id="free-consult-desc" className="mt-2 text-sm leading-relaxed text-white/80">
                Platforma hoş geldiniz. Size özel ücretsiz ön görüşme hakkınızı kullanarak
                doğru uzmanı bulmanıza yardımcı olalım.
              </p>
            </div>
          </div>

          {/* İçerik */}
          <div className="px-6 pb-6 pt-5">
            <ul className="space-y-3">
              {[
                { icon: Clock, text: "30 dakikalık tanışma seansı" },
                { icon: MessageCircle, text: "Uzmanla birebir değerlendirme" },
                { icon: Star, text: "Hiçbir ücret talep edilmez" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-4 text-primary" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button asChild className="flex-1" onClick={handleClose}>
                <Link href="/uzmanlar">Uzmanları İncele</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Daha Sonra
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
