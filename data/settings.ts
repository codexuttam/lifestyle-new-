/**
 * Contact details and site-wide chrome for Lifestyle Home Spaces & Aura by Lifestyle.
 */

export type SiteSettings = {
  brandName: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  bookingContact: string;
  reraNumber: string;
  copyright: string;
  social: { label: string; href: string }[];
};

export const SITE_SETTINGS: SiteSettings = {
  brandName: "Aura by Lifestyle",
  whatsapp: "919730768982",
  phone: "+919730768982",
  bookingContact: "777-0000-750",
  email: "admin@lifestylehomespaces.com",
  address: "Site & Office: Aura by Lifestyle, Congress Nagar Road, Next to Dreamz Signature, Congress Nagar, Camp, Amravati — 444606",
  reraNumber: "P5030002502915",
  copyright: "© 2026 Lifestyle Home Spaces. All rights reserved. MahaRERA Reg. No. P5030002502915",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/lifestylerealestate_11" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591959993385" },
    { label: "WhatsApp", href: "https://wa.me/919730768982" },
  ],
};
