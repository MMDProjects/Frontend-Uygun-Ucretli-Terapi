"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
  message: string;
  onDismiss: () => void;
};

export function DangerPanicOverlay({ message, onDismiss }: Props) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Acil sistem uyarısı"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-red-950/90 backdrop-blur-sm"
    >
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-3xl border-2 border-red-500 bg-white shadow-2xl">
        {/* Kırmızı üst şerit */}
        <div className="flex items-center gap-3 bg-red-600 px-6 py-4">
          <span className="relative flex size-8 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75" />
            <AlertTriangle className="relative size-8 text-white" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-wide text-white">ACİL SİSTEM UYARISI</span>
        </div>

        {/* İçerik */}
        <div className="px-6 py-6">
          <p className="text-sm font-medium leading-7 text-foreground">{message}</p>
        </div>

        {/* Kapatma */}
        <div className="border-t border-border/60 px-6 py-4">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
