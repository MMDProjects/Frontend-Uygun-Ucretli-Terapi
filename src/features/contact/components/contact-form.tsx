"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  contactFormSchema,
  corporateContactFormSchema,
  type CorporateContactFormValues,
  type ContactFormValues,
} from "@/features/contact/schemas/contact-form-schema";
import { submitContact, type ContactPayload } from "@/lib/services/public.service";

type ContactFormProps = {
  title: string;
  description: string;
  variant?: "general" | "corporate";
};

const GENERAL_KEY = "contact-form-draft";
const CORPORATE_KEY = "corporate-form-draft";

const subjectOptions = [
  { value: "soru-sorun", label: "Soru / Sorun" },
  { value: "randevu", label: "Randevu Oluşturun" },
  { value: "oneri", label: "Öneri" },
  { value: "sikayet", label: "Şikayet" },
  { value: "diger", label: "Diğer" },
] as const;

const corporateSubjectOptions = [
  { value: "kurumsal-danismanlik", label: "Kurumsal Danışmanlık" },
  { value: "calisan-destek-programi", label: "Çalışan Destek Programı" },
  { value: "egitim-ve-atolye", label: "Eğitim ve Atölye" },
  { value: "teklif-talebi", label: "Teklif Talebi" },
  { value: "diger", label: "Diğer" },
] as const;

type GeneralSubject = (typeof subjectOptions)[number]["value"];
type CorporateSubject = (typeof corporateSubjectOptions)[number]["value"];
type SubjectEnum = ContactPayload["subject"];

const subjectMap: Record<GeneralSubject, SubjectEnum> = {
  "soru-sorun": "SORU_SORUN",
  randevu: "RANDEVU_OLUSTURUN",
  oneri: "ONERI",
  sikayet: "SIKAYET",
  diger: "DIGER",
};

const corporateSubjectMap: Record<CorporateSubject, SubjectEnum> = {
  "kurumsal-danismanlik": "KURUMSAL_DANISMANLIK",
  "calisan-destek-programi": "CALISAN_DESTEK_PROGRAMI",
  "egitim-ve-atolye": "EGITIM_VE_ATOLYE",
  "teklif-talebi": "TEKLIF_TALEBI",
  diger: "DIGER",
};

const generalDefaults: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "soru-sorun",
  message: "",
  kvkkApproved: false,
};

const corporateDefaults: CorporateContactFormValues = {
  companyName: "",
  authorizedPerson: "",
  email: "",
  phone: "",
  employeeCount: "",
  subject: "kurumsal-danismanlik",
  message: "",
  kvkkApproved: false,
};

function readDraft(key: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function KvkkDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary-hover">
            KVKK Aydınlatma Metni
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (&quot;KVKK&quot;) kapsamında, <strong className="text-foreground">PsikoDestek</strong>{" "}
            tarafından kişisel verilerinizin işlenmesine ilişkin bilgilendirme amacıyla
            hazırlanmıştır.
          </p>

          <div>
            <p className="font-semibold text-foreground">1. Veri Sorumlusu</p>
            <p>
              Kişisel verileriniz, veri sorumlusu sıfatıyla PsikoDestek tarafından
              işlenmektedir.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">2. İşlenen Kişisel Veriler</p>
            <p>
              Ad-soyad, e-posta adresi, telefon numarası ve iletişim formu aracılığıyla
              ilettiğiniz mesaj içerikleri işlenmektedir. Kurumsal başvurularda ek olarak
              şirket adı ve yetkili kişi bilgileri de toplanmaktadır.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">3. Kişisel Verilerin İşlenme Amaçları</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>İletişim taleplerinizin karşılanması ve yanıtlanması</li>
              <li>Randevu ve ön görüşme taleplerinin yönetilmesi</li>
              <li>Hizmet kalitesinin geliştirilmesi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground">4. Kişisel Verilerin Aktarımı</p>
            <p>
              Kişisel verileriniz; hizmetin ifası için zorunlu olmadıkça üçüncü kişilere
              aktarılmaz. Yalnızca e-posta altyapısı (Brevo) ve sunucu hizmetleri kapsamında
              teknik hizmet sağlayıcılarla, veri güvenliği sözleşmeleri çerçevesinde
              paylaşılabilir.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">5. Kişisel Verilerin Saklanma Süresi</p>
            <p>
              İletişim formundan toplanan veriler, talebinizin tamamlanmasından itibaren
              en fazla 2 yıl süreyle saklanmakta; bu sürenin sonunda silinmekte veya
              anonimleştirilmektedir.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">6. İlgili Kişi Hakları</p>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde / yurt dışında aktarıldığı üçüncü kişileri öğrenme</li>
              <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
              <li>İşleme koşullarının ortadan kalkması halinde silinmesini isteme</li>
              <li>Düzeltme ve silme işlemlerinin aktarılan kişilere bildirilmesini isteme</li>
              <li>Otomatik sistemlerle analiz sonucu aleyhte kararın itiraz etme</li>
              <li>Kanuna aykırı işleme nedeniyle oluşan zararın tazmin edilmesini isteme</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground">7. Veri Güvenliği</p>
            <p>
              Kişisel verileriniz AES-256 şifreleme ile korunmakta, yetkisiz erişime
              karşı teknik ve idari tedbirler uygulanmaktadır. Psikolojik danışmanlık
              süreçlerine ilişkin hassas veriler özel güvenlik protokolleriyle saklanmaktadır.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">8. İletişim</p>
            <p>
              Yukarıdaki haklarınızı kullanmak veya kişisel verilerinizle ilgili soru
              iletmek için{" "}
              <a
                href="mailto:kvkk@psikodestek.com"
                className="text-primary underline underline-offset-2"
              >
                kvkk@psikodestek.com
              </a>{" "}
              adresine başvurabilirsiniz.
            </p>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-1.5 size-4" />
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ContactForm({
  title,
  description,
  variant = "general",
}: ContactFormProps) {
  const isCorporate = variant === "corporate";
  const storageKey = isCorporate ? CORPORATE_KEY : GENERAL_KEY;
  const [kvkkOpen, setKvkkOpen] = useState(false);

  const draft = readDraft(storageKey);

  const form = useForm<ContactFormValues | CorporateContactFormValues>({
    resolver: zodResolver(
      isCorporate ? corporateContactFormSchema : contactFormSchema,
    ),
    defaultValues: isCorporate
      ? { ...corporateDefaults, ...(draft ?? {}) }
      : { ...generalDefaults, ...(draft ?? {}) },
  });

  // Persist form values to sessionStorage on every change
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        // ignore quota errors
      }
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);

  async function onSubmit(values: ContactFormValues | CorporateContactFormValues) {
    try {
      let payload: ContactPayload;

      if (isCorporate) {
        const v = values as CorporateContactFormValues;
        payload = {
          fullName: v.authorizedPerson,
          email: v.email,
          phone: v.phone,
          subject: corporateSubjectMap[v.subject as CorporateSubject],
          message: v.message,
          isCorporate: true,
          companyName: v.companyName,
          employeeCount: v.employeeCount,
          kvkkApproved: v.kvkkApproved,
        };
      } else {
        const v = values as ContactFormValues;
        payload = {
          fullName: v.fullName,
          email: v.email,
          phone: v.phone,
          subject: subjectMap[v.subject as GeneralSubject],
          message: v.message,
          isCorporate: false,
          kvkkApproved: v.kvkkApproved,
        };
      }

      await submitContact(payload);
      toast.success("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");
      sessionStorage.removeItem(storageKey);
      form.reset(isCorporate ? corporateDefaults : generalDefaults);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gönderim başarısız.";
      toast.error(msg);
    }
  }

  return (
    <>
      <KvkkDialog open={kvkkOpen} onClose={() => setKvkkOpen(false)} />

      <div className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-semibold text-primary-hover">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            {isCorporate ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Şirket Adı <span className="text-destructive">*</span></Label>
                  <Input id="companyName" {...form.register("companyName")} />
                  <p className="text-xs text-destructive">
                    {"companyName" in form.formState.errors
                      ? form.formState.errors.companyName?.message
                      : undefined}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorizedPerson">Yetkili Kişi <span className="text-destructive">*</span></Label>
                  <Input id="authorizedPerson" {...form.register("authorizedPerson")} />
                  <p className="text-xs text-destructive">
                    {"authorizedPerson" in form.formState.errors
                      ? form.formState.errors.authorizedPerson?.message
                      : undefined}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad <span className="text-destructive">*</span></Label>
                <Input id="fullName" {...form.register("fullName")} />
                <p className="text-xs text-destructive">
                  {"fullName" in form.formState.errors
                    ? form.formState.errors.fullName?.message
                    : undefined}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" {...form.register("email")} />
              <p className="text-xs text-destructive">
                {form.formState.errors.email?.message}
              </p>
            </div>
            {!isCorporate && (
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon <span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" {...form.register("phone")} />
                <p className="text-xs text-destructive">
                  {"phone" in form.formState.errors
                    ? form.formState.errors.phone?.message
                    : undefined}
                </p>
              </div>
            )}
            {isCorporate && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon <span className="text-destructive">*</span></Label>
                  <Input id="phone" type="tel" {...form.register("phone")} />
                  <p className="text-xs text-destructive">
                    {"phone" in form.formState.errors
                      ? form.formState.errors.phone?.message
                      : undefined}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Çalışan Sayısı (Opsiyonel)</Label>
                  <Input id="employeeCount" {...form.register("employeeCount")} placeholder="Ör. 50-100" />
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Konu <span className="text-destructive">*</span></Label>
            <select
              id="subject"
              className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("subject")}
            >
              {(isCorporate ? corporateSubjectOptions : subjectOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj <span className="text-destructive">*</span></Label>
            <Textarea id="message" rows={5} {...form.register("message")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.message?.message}
            </p>
          </div>

          {/* KVKK checkbox + görüntüle */}
          <div className="space-y-1.5">
            <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-border accent-primary"
                {...form.register("kvkkApproved")}
              />
              <span>
                <button
                  type="button"
                  onClick={() => setKvkkOpen(true)}
                  className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition"
                >
                  <FileText className="size-3.5" />
                  KVKK Aydınlatma Metni
                </button>
                &apos;ni okudum, kişisel verilerimin işlenmesine onay veriyorum.{" "}
                <span className="text-destructive">*</span>
              </span>
            </label>
            <p className="text-xs text-destructive">
              {form.formState.errors.kvkkApproved?.message}
            </p>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Gönderiliyor…
              </>
            ) : (
              "Gönder"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
