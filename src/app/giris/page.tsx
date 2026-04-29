"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";

const MOCK_USERS = [
  { email: "danisan10@gmail.com", password: "danisan10", displayName: "Deniz Yılmaz", role: "danisan" as const },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const user = MOCK_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    setSession({ isAuthenticated: true, displayName: user.displayName, role: user.role });
    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-7 space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground">Giriş Yap</h1>
            <p className="text-sm text-muted-foreground">
              Hesabınıza giriş yapın ve kaldığınız yerden devam edin.
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Şifre <span className="text-destructive">*</span>
                </Label>
                <Link
                  href="/sifre-sifirla"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Şifremi unuttum
                </Link>
              </div>
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
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-primary hover:underline">
            Ücretsiz kayıt olun
          </Link>
        </p>
      </div>
    </main>
  );
}
