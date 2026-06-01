import Link from "next/link";
import { Clock, Send } from "lucide-react";

export default function TaleplerimPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-[#cce1de] pt-[calc(var(--site-header-height)+2rem)] pb-8">
        <div className="page-shell">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
            Taleplerim
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Görüşme taleplerinizi buradan takip edebilirsiniz.
          </p>
        </div>
      </section>

      <section className="bg-[#e6f0ee] py-16">
        <div className="page-shell flex flex-col items-center text-center gap-6 max-w-md mx-auto">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Clock className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Yakında</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Talep takip özelliği Faz 2&apos;de aktif olacak. Şu an görüşme talebinizi
              iletişim formu üzerinden iletebilirsiniz.
            </p>
          </div>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
          >
            <Send className="size-4" />
            İletişim Formu
          </Link>
        </div>
      </section>
    </>
  );
}
