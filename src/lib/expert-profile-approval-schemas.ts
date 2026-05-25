import { z } from "zod";

/** Reject with optional revision note — admin may leave empty. */
export const expertProfileRejectSchema = z.object({
  revisionNote: z
    .string()
    .max(2000, "Revize notu en fazla 2000 karakter olabilir.")
    .transform((s) => s.trim()),
});

export type ExpertProfileRejectForm = z.infer<typeof expertProfileRejectSchema>;
