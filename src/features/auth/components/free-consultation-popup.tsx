"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { X, MessageCircle, Star, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";

type PopupSettings = {
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  buttonUrl: string;
};

const DEFAULT_POPUP: PopupSettings = {
  title: "Ücretsiz Ön Görüşme\nHakkınız Hazır",
  description:
    "Platforma hoş geldiniz. Size özel ücretsiz ön görüşme hakkınızı kullanarak doğru uzmanı bulmanıza yardımcı olalım.",
  benefits: [
    "30 dakikalık tanışma seansı",
    "Uzmanla birebir değerlendirme",
    "Hiçbir ücret talep edilmez",
  ],
  buttonText: "Uzmanları İncele",
  buttonUrl: "/uzmanlar",
};

const BENEFIT_ICONS = [Clock, MessageCircle, Star];

export function FreeConsultationPopup() {
  const { isAuthenticated, hasSeenFreeConsultPopup, markFreeConsultSeen } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState<PopupSettings>(DEFAULT_POPUP);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    if (!apiUrl) return;
    fetch(`${apiUrl}/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.loginPopupSettings && typeof data.loginPopupSettings === "object") {
          const s = data.loginPopupSettings as Partial<PopupSettings>;
          setPopup({
            title: s.title || DEFAULT_POPUP.title,
            description: s.description || DEFAULT_POPUP.description,
            benefits: Array.isArray(s.benefits) && s.benefits.length > 0 ? s.benefits : DEFAULT_POPUP.benefits,
            buttonText: s.buttonText || DEFAULT_POPUP.buttonText,
            buttonUrl: s.buttonUrl || DEFAULT_POPUP.buttonUrl,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const alreadySeen = localStorage.getItem("free_consult_seen") === "1";
    if (isAuthenticated && !hasSeenFreeConsultPopup && !alreadySeen) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasSeenFreeConsultPopup]);

  function handleClose() {
    setOpen(false);
    markFreeConsultSeen();
    localStorage.setItem("free_consult_seen", "1");
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/80 bg-white p-0 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-lg"
          aria-describedby="free-consult-desc"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="Kapat"
            >
              <X className="size-4" />
            </button>
          </Dialog.Close>

          {/* Üst bant */}
          <div className="relative overflow-hidden rounded-t-3xl bg-primary px-6 pb-8 pt-7">
            <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/10" />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                <Star className="size-3 fill-white" />
                Hoş geldiniz!
              </span>
              <Dialog.Title className="mt-3 whitespace-pre-line text-2xl font-bold leading-tight text-white">
                {popup.title}
              </Dialog.Title>
              <p id="free-consult-desc" className="mt-2 text-sm leading-relaxed text-white/80">
                {popup.description}
              </p>
            </div>
          </div>

          {/* İçerik */}
          <div className="px-6 pb-6 pt-5">
            <ul className="space-y-3">
              {popup.benefits.map((text, i) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
                return (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-4 text-primary" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button asChild className="flex-1" onClick={handleClose}>
                <Link href={popup.buttonUrl}>{popup.buttonText}</Link>
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Daha Sonra
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
