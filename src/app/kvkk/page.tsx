import { PageIntro } from "@/components/common/page-intro";

export default function KvkkPage() {
  return (
    <>
      <PageIntro
        title="Yasal metinler icin temel sayfa"
        description="KVKK ve diger yasal iceriklerin statik veya CMS kaynakli olarak yayinlanacagi alan ayrildi."
      />
      <section className="pb-16">
        <div className="page-shell">
          <article className="surface-card max-w-4xl p-8 text-sm leading-7 text-muted-foreground">
            Yasal metinler ilerleyen asamada proje icerigiyle degistirilecek.
          </article>
        </div>
      </section>
    </>
  );
}
