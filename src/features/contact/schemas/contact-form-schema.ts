import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Ad soyad zorunludur."),
  email: z.string().email("Gecerli bir e-posta girin."),
  subject: z.enum([
    "soru-sorun",
    "randevu",
    "oneri",
    "sikayet",
    "diger",
  ]),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalidir."),
  kvkkApproved: z
    .boolean()
    .refine((value) => value, "KVKK onayi zorunludur."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const corporateContactFormSchema = z.object({
  companyName: z.string().min(2, "Sirket adi zorunludur."),
  authorizedPerson: z.string().min(2, "Yetkili kisi zorunludur."),
  email: z.string().email("Gecerli bir e-posta girin."),
  phone: z.string().min(10, "Gecerli bir telefon numarasi girin."),
  employeeCount: z.string().optional(),
  subject: z.enum([
    "kurumsal-danismanlik",
    "calisan-destek-programi",
    "egitim-ve-atolye",
    "teklif-talebi",
    "diger",
  ]),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalidir."),
  kvkkApproved: z
    .boolean()
    .refine((value) => value, "KVKK onayi zorunludur."),
});

export type CorporateContactFormValues = z.infer<
  typeof corporateContactFormSchema
>;
