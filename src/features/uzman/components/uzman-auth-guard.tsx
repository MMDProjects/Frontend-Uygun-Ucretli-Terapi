"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export function UzmanAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || role !== "uzman") {
      router.replace("/giris");
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== "uzman") {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
