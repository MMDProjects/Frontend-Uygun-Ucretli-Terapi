import { z } from "zod";

/** Reject with optional revision note (same UX as profil onayları). */
export const blogApprovalRejectSchema = z.object({
  revisionNote: z
    .string()
    .max(2000, "Revize notu en fazla 2000 karakter olabilir.")
    .transform((s) => s.trim()),
});

export type BlogApprovalRejectForm = z.infer<typeof blogApprovalRejectSchema>;

const trimmed = z.string().trim();

export const blogAdminRevisionSchema = z.object({
  title: trimmed.min(1, "Başlık zorunludur.").max(300, "Başlık en fazla 300 karakter."),
  excerpt: trimmed.max(500, "Özet en fazla 500 karakter."),
  content: trimmed.min(1, "İçerik zorunludur.").max(100_000, "İçerik çok uzun."),
});

export type BlogAdminRevisionForm = z.infer<typeof blogAdminRevisionSchema>;
