import type { Metadata } from "next";
import { PageIntro } from "@/components/common/page-intro";
import { getPublicKvkk, type KvkkSection } from "@/lib/services/public.service";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Uygun Ücretli Terapi platformu kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.",
};

export const revalidate = 3600;

export default async function KvkkPage() {
  const kvkk = await getPublicKvkk();
  const sections: KvkkSection[] = kvkk?.sections ?? [];
  const version = kvkk?.version ?? "";

  return (
    <>
      <PageIntro
        title="KVKK Aydınlatma Metni"
        description="Kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğuna dair bilgilendirme."
      />

      <section className="pb-20 pt-4">
        <div className="page-shell">
          <div className="mx-auto max-w-3xl">
            {version && (
              <p className="mb-8 text-sm text-muted-foreground">
                Son güncelleme: {version}
              </p>
            )}

            <div className="rounded-2xl border border-border bg-white shadow-sm">
              {/* İçindekiler */}
              {sections.length > 0 && (
                <div className="border-b border-border px-8 py-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    İçindekiler
                  </p>
                  <nav className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {sections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="text-sm text-primary underline-offset-2 hover:underline"
                      >
                        {s.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Bölümler */}
              <div className="divide-y divide-border">
                {sections.map((s) => (
                  <div key={s.id} id={s.id} className="px-8 py-7 scroll-mt-24">
                    <h2 className="mb-4 text-base font-semibold text-foreground">
                      {s.title}
                    </h2>
                    <div
                      className="kvkk-content text-sm leading-7 text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: s.html }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
