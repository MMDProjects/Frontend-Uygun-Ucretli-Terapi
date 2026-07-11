import type { Metadata } from "next";
import { getSss } from "@/lib/services/public.service";
import { SssFullList } from "@/components/common/sss-full-list";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Yeçamer hakkında merak ettikleriniz: nasıl çalışır, ücretler, uzman başvurusu ve daha fazlası.",
  openGraph: {
    title: "Sık Sorulan Sorular | Yeçamer",
    description:
      "Yeçamer hakkında merak ettikleriniz: nasıl çalışır, ücretler, uzman başvurusu.",
    url: "https://yecamer.online/sss",
  },
};

export const revalidate = 0;

export default async function FaqPage() {
  let items: Awaited<ReturnType<typeof getSss>> = [];
  try {
    items = await getSss();
  } catch {
    items = [];
  }

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="section-shell relative overflow-hidden border-b border-border/70 bg-[#cce1de]">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-hover sm:text-5xl">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              Aklınızdaki soruların cevaplarını burada bulabilirsiniz.
              Bulamadığınız sorular için bize{" "}
              <a href="/iletisim" className="font-medium underline underline-offset-4 hover:text-primary">
                iletişim formu
              </a>{" "}
              aracılığıyla ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-10">
        <div className="page-shell max-w-3xl">
          <SssFullList items={sorted} />
        </div>
      </section>
    </>
  );
}
