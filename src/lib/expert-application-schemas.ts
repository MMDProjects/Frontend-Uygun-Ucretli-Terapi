import { z } from "zod";

export const expertApplicationRejectSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(10, "Red gerekçesi en az 10 karakter olmalıdır.")
    .max(2000, "Red gerekçesi en fazla 2000 karakter olabilir."),
});

export type ExpertApplicationRejectForm = z.infer<typeof expertApplicationRejectSchema>;
