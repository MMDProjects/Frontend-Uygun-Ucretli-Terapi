"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdminSessionCookies, verifyDemoLogin } from "@/lib/demo-auth";

export default function AdminGirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const user = verifyDemoLogin(email.trim().toLowerCase(), password);
    setLoading(false);

    if (!user) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    setAdminSessionCookies("user");
    toast.success(`Hoş geldiniz, ${user.name}`);
    router.push("/admin/dashboard");
  }

  function handleDemoLogin() {
    setAdminSessionCookies("demo");
    toast.success("Demo oturumu açıldı.");
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-7 space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground">
              Yönetim Paneli
            </h1>
            <p className="text-sm text-muted-foreground">
              Yönetici hesabınızla giriş yapın.
            </p>
          </div>

          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-posta <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                autoComplete="email"
                className="h-11 rounded-2xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Şifre <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-2xl pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <p className="text-xs font-medium text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Giriş yapılıyor…
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
            >
              Demo ile giriş yap
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
