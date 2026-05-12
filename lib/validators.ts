import { z } from "zod";

export const scanRequestSchema = z.object({
  url: z
    .string()
    .url("Ogiltig URL")
    .refine(
      (u) => u.startsWith("http://") || u.startsWith("https://"),
      "URL måste börja med http:// eller https://",
    )
    .refine(
      (u) => !/(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)/.test(u),
      "Lokala adresser kan inte skannas",
    )
    .refine(
      (u) => {
        try {
          return !/\.(local|internal|test|invalid)$/.test(new URL(u).hostname);
        } catch {
          // Malformed URL — earlier refines surface a clearer error.
          return true;
        }
      },
      "Interna domäner kan inte skannas",
    ),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;

export const emailCaptureSchema = z.object({
  scanId: z.string().min(1),
  email: z.string().email("Ogiltig e-postadress"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Du måste godkänna integritetspolicyn" }),
  }),
});

export type EmailCaptureRequest = z.infer<typeof emailCaptureSchema>;
