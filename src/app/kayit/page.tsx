import { AuthCard } from "@/components/common/auth-card";
import { PageIntro } from "@/components/common/page-intro";

export default function RegisterPage() {
  return (
    <>
      <PageIntro
        title="KVKK ve bulten ayrimini destekleyecek kayit iskeleti"
        description="Danisan kayit formu briefteki alanlara gore sonraki iterasyonda RHF + Zod ile detaylandirilacak."
      />
      <section className="pb-16">
        <div className="page-shell">
          <AuthCard
            title="Kayit Ol"
            description="Kayit akisinda ad, soyad, telefon, e-posta ve sifre alanlari icin ilk form kabugu hazirlandi."
            fields={[
              { id: "firstName", label: "Ad" },
              { id: "lastName", label: "Soyad" },
              { id: "phone", label: "Telefon" },
              { id: "email", label: "E-posta", type: "email" },
              { id: "password", label: "Sifre", type: "password" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
