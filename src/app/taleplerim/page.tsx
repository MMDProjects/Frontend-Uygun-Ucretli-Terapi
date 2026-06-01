"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle, MessageCircle, Send, XCircle } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { getMyDanisanRequests, type ApiDanisanRequest } from "@/lib/services/danisan.service";

const statusConfig = {
  BEKLEMEDE:             { label: "Beklemede",  color: "text-warning",          bg: "bg-warning/10",     icon: Clock },
  UZMANA_YONLENDIRILDI:  { label: "Yanıtlandı", color: "text-primary",          bg: "bg-primary/10",     icon: MessageCircle },
  TAMAMLANDI:            { label: "Tamamlandı", color: "text-muted-foreground", bg: "bg-muted",           icon: CheckCircle },
  REDDEDILDI:            { label: "Reddedildi", color: "text-destructive",      bg: "bg-destructive/10", icon: XCircle },
} as const;

export default function TaleplerimPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [requests, setRequests] = useState<ApiDanisanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris?redirect=/taleplerim");
      return;
    }
    getMyDanisanRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-8">
        <div className="page-shell">
          <div className="flex items-center gap-4">
            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
                Taleplerim
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                İletişim formu üzerinden ilettiğiniz görüşme talepleri
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-10">
        <div className="page-shell">
          {/* Yeni talep CTA */}
          <div className="mb-8 flex flex-col gap-3 rounded-[1.5rem] border border-primary/20 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-primary-hover">
                Yeni görüşme talebi mi açmak istiyorsunuz?
              </p>
              <p className="text-sm text-muted-foreground">
                Talepler iletişim formumuz üzerinden alınmaktadır. Ekibimiz sizi en uygun
                uzmanla eşleştirir.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/iletisim">
                <Send className="mr-2 size-4" />
                Yeni Talep Aç
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-[2rem] bg-muted" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="font-semibold text-foreground">Henüz talep yok</p>
              <p className="text-sm text-muted-foreground">
                Bir uzmanın profiline gidip talep gönderebilirsiniz.
              </p>
              <Button asChild>
                <Link href="/uzmanlar">Uzmanları İncele</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {requests.map((req) => {
                  const cfg = statusConfig[req.status] ?? statusConfig.BEKLEMEDE;
                  const { label, color, bg, icon: Icon } = cfg;
                  const expertName = `${req.expertProfile.user.firstName} ${req.expertProfile.user.lastName}`.trim();
                  const dateLabel = new Date(req.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <article
                      key={req.id}
                      className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm lg:rounded-[2.25rem]"
                    >
                      <h3 className="text-lg font-semibold text-primary-hover">{expertName}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{req.expertProfile.title}</p>

                      <span
                        className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${bg} ${color}`}
                      >
                        <Icon className="size-3" />
                        {label}
                      </span>

                      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground line-clamp-4">
                        {req.message}
                      </p>

                      <span className="mt-3 text-xs text-muted-foreground">{dateLabel}</span>

                      <Link
                        href={`/uzmanlar/${req.expertProfile.id}`}
                        className="absolute bottom-4 right-4 z-[3] inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-center text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-hover hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                      >
                        Profile Git
                      </Link>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-[2rem] border border-dashed border-border/80 bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Farklı bir uzmanla görüşmek ister misiniz?
                </p>
                <Button asChild variant="outline" className="mt-3">
                  <Link href="/uzmanlar">
                    Uzmanları İncele
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
