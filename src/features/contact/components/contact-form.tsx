"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  corporateContactFormSchema,
  type CorporateContactFormValues,
  type ContactFormValues,
} from "@/features/contact/schemas/contact-form-schema";
import { submitContact, getPublicKvkk, type ContactPayload } from "@/lib/services/public.service";

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


export function ContactForm({
  title,
  description,
  variant = "general",
}: ContactFormProps) {
  const isCorporate = variant === "corporate";
  const storageKey = isCorporate ? CORPORATE_KEY : GENERAL_KEY;
  const kvkkVersionIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    getPublicKvkk().then((data) => {
      if (data?.id) kvkkVersionIdRef.current = data.id;
    }).catch(() => {});
  }, []);

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
          kvkkVersionId: kvkkVersionIdRef.current,
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
          kvkkVersionId: kvkkVersionIdRef.current,
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
                <a
                  href="/kvkk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition"
                >
                  <FileText className="size-3.5" />
                  KVKK Aydınlatma Metni
                </a>
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
  );
}
