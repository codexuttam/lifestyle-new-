import { z } from "zod";

export const settingsSchema = z.object({
  /** Digits only, country code first — used to build wa.me links. */
  whatsapp: z.string().regex(/^\d{8,15}$/, "Digits only, including country code"),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  copyright: z.string().min(1),
  social: z.array(
    z.object({ label: z.string().min(1), href: z.string().url() })
  ),
});

export type SettingsRecord = z.infer<typeof settingsSchema>;

/** Convenience helpers so link construction lives in one place. */
export function whatsappHref(settings: SettingsRecord) {
  return `https://wa.me/${settings.whatsapp}`;
}

export function telHref(settings: SettingsRecord) {
  return `tel:${settings.phone}`;
}

export function mailtoHref(settings: SettingsRecord) {
  return `mailto:${settings.email}`;
}
