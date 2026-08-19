/**
 * Contact details and site-wide chrome.
 *
 * These values were previously pasted inline across a dozen components — the
 * WhatsApp number alone appeared 12 times. Editing them here (or in the CMS)
 * now changes every occurrence at once.
 */

export type SiteSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
  social: { label: string; href: string }[];
};

export const SITE_SETTINGS: SiteSettings = {
  whatsapp: "916398792951",
  phone: "+916398792951",
  email: "hello@thepremiumconstruction.in",
  address: "412, Suncity Business Tower, Gurugram",
  copyright: "© 2026 The Premium Construction Pvt. Ltd.",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Linkedin", href: "https://linkedin.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
};
