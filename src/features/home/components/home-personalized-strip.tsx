"use client";

import Link from "next/link";

import { useAuthStore } from "@/lib/stores/auth-store";

export function HomePersonalizedStrip() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const displayName = useAuthStore((s) => s.displayName);

  if (!isAuthenticated) return null;

  return (
    <div
      className="rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground"
      role="status"
    >
      {displayName ? (
        <span className="font-medium text-foreground">Merhaba, {displayName}. </span>
      ) : null}
      Test arşivinizi ve taleplerinizi aynı site üzerinden yönetirsiniz.{" "}
      <Link href="/testler" className="font-semibold text-primary underline-offset-2 hover:underline">
        Önceki sonuçlarım
      </Link>{" "}
      bölümüne göz atabilirsiniz.
    </div>
  );
}
