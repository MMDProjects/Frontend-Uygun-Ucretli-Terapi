"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export function UzmanAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const role = useAuthStore((s) => s.role);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || role !== "uzman") {
      router.replace("/giris");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, role]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || role !== "uzman") {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
