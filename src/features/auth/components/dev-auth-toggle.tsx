"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { logout } from "@/lib/services/auth.service";

export function DevAuthToggle() {
  const { isAuthenticated, role, setSession } = useAuthStore();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-28 left-3 z-50 flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-white/90 p-2.5 shadow-lg backdrop-blur-sm">
      <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Dev · Auth
      </p>

      {isAuthenticated ? (
        <>
          <p className="px-1 text-[10px] text-muted-foreground">
            {role === "uzman" ? "👨‍⚕️ Uzman" : role === "admin" ? "🛡 Admin" : "🙋 Danışan"}
          </p>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20"
          >
            Çıkış Yap
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() =>
              setSession({
                userId: "dev-danisan",
                displayName: "Selin Karaca",
                email: "selin@dev.com",
                role: "danisan",
              })
            }
            className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            Danışan Giriş
          </button>
          <button
            type="button"
            onClick={() =>
              setSession({
                userId: "dev-uzman",
                displayName: "Dr. Ayşe Kaya",
                email: "ayse@dev.com",
                role: "uzman",
              })
            }
            className="rounded-xl bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary transition hover:bg-secondary/20"
          >
            Uzman Giriş
          </button>
          <button
            type="button"
            onClick={() =>
              setSession({
                userId: "dev-admin",
                displayName: "Admin",
                email: "admin@dev.com",
                role: "admin",
              })
            }
            className="rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20"
          >
            Admin Giriş
          </button>
        </>
      )}
    </div>
  );
}
