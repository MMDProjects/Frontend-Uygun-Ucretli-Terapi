"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

type ContactFormProps = {
  title: string;
  description: string;
  variant?: "general" | "corporate";
};

const subjectOptions = [
  { value: "soru-sorun", label: "Soru Sorun" },
  { value: "randevu", label: "Randevu Olusturun" },
  { value: "oneri", label: "Oneri" },
  { value: "sikayet", label: "Sikayet" },
  { value: "diger", label: "Diger" },
] as const;

const corporateSubjectOptions = [
  { value: "kurumsal-danismanlik", label: "Kurumsal Danismanlik" },
  { value: "calisan-destek-programi", label: "Calisan Destek Programi" },
  { value: "egitim-ve-atolye", label: "Egitim ve Atolye" },
  { value: "teklif-talebi", label: "Teklif Talebi" },
  { value: "diger", label: "Diger" },
] as const;

export function ContactForm({
  title,
  description,
  variant = "general",
}: ContactFormProps) {
  const isCorporate = variant === "corporate";
  const form = useForm<ContactFormValues | CorporateContactFormValues>({
    resolver: zodResolver(
      isCorporate ? corporateContactFormSchema : contactFormSchema,
    ),
    defaultValues: isCorporate
      ? {
          companyName: "",
          authorizedPerson: "",
          email: "",
          phone: "",
          employeeCount: "",
          subject: "kurumsal-danismanlik",
          message: "",
          kvkkApproved: false,
        }
      : {
          fullName: "",
          email: "",
          phone: "",
          subject: "soru-sorun",
          message: "",
          kvkkApproved: false,
        },
  });

  const onSubmit = (values: ContactFormValues | CorporateContactFormValues) => {
    void values;
  };

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
                <Label htmlFor="companyName">Sirket Adi *</Label>
                <Input id="companyName" {...form.register("companyName")} />
                <p className="text-xs text-destructive">
                  {"companyName" in form.formState.errors
                    ? form.formState.errors.companyName?.message
                    : undefined}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorizedPerson">Yetkili Kisi *</Label>
                <Input
                  id="authorizedPerson"
                  {...form.register("authorizedPerson")}
                />
                <p className="text-xs text-destructive">
                  {"authorizedPerson" in form.formState.errors
                    ? form.formState.errors.authorizedPerson?.message
                    : undefined}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad *</Label>
              <Input id="fullName" {...form.register("fullName")} />
              <p className="text-xs text-destructive">
                {"fullName" in form.formState.errors
                  ? form.formState.errors.fullName?.message
                  : undefined}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
            <Input id="email" type="email" {...form.register("email")} />
            <p className="text-xs text-destructive">
              {form.formState.errors.email?.message}
            </p>
          </div>
          {!isCorporate && (
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <Input id="phone" type="tel" {...form.register("phone")} />
              <p className="text-xs text-destructive">
                {"phone" in form.formState.errors
                  ? form.formState.errors.phone?.message
                  : undefined}
              </p>
            </div>
          )}
          {isCorporate ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input id="phone" type="tel" {...form.register("phone")} />
                <p className="text-xs text-destructive">
                  {"phone" in form.formState.errors
                    ? form.formState.errors.phone?.message
                    : undefined}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeCount">
                  Calisan Sayisi (Opsiyonel)
                </Label>
                <Input
                  id="employeeCount"
                  {...form.register("employeeCount")}
                  placeholder="Orn. 50-100"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Konu *</Label>
          <select
            id="subject"
            className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            {...form.register("subject")}
          >
            {(isCorporate ? corporateSubjectOptions : subjectOptions).map(
              (option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mesaj *</Label>
          <Textarea id="message" {...form.register("message")} />
          <p className="text-xs text-destructive">
            {form.formState.errors.message?.message}
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-border"
            {...form.register("kvkkApproved")}
          />
          <span>KVKK onayini kabul ediyorum. *</span>
        </label>
        <p className="text-xs text-destructive">
          {form.formState.errors.kvkkApproved?.message}
        </p>

        <Button type="submit">Gonder</Button>
      </form>
    </div>
  );
}
