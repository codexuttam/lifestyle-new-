/** Gallery items. Seeds the Firestore collection of the same name. */

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    "id": "gallery-1",
    "src": "/images/gallery_1_1779379484199.png",
    "alt": "Modern Luxury Villa at Twilight",
    "caption": "Modern Villa · Gurugram 2024"
  },
  {
    "id": "gallery-2",
    "src": "/images/gallery_2_1779379510372.png",
    "alt": "High-end Residential Construction Site",
    "caption": "Contemporary Home · Noida 2023"
  },
  {
    "id": "gallery-3",
    "src": "/images/gallery_3_1779379534787.png",
    "alt": "Contemporary Smart Home Exterior",
    "caption": "Luxury Bungalow · Delhi 2022"
  },
  {
    "id": "gallery-4",
    "src": "/images/gallery_4_1779379550084.png",
    "alt": "Construction Workers Pouring Concrete",
    "caption": "Minimalist Design · Gurugram 2024"
  },
  {
    "id": "gallery-5",
    "src": "/images/gallery_5_1779379567777.png",
    "alt": "Classic Architecture Luxury Bungalow",
    "caption": "Classic Architecture · Delhi 2023"
  },
  {
    "id": "gallery-6",
    "src": "/images/gallery_6_1779379588256.png",
    "alt": "Modern House Interior During Construction",
    "caption": "Smart Home · Noida 2024"
  },
  {
    "id": "gallery-7",
    "src": "/images/gallery_7_1779379605692.png",
    "alt": "Premium Finished Living Room",
    "caption": "Premium Finish · Gurugram 2022"
  },
  {
    "id": "gallery-8",
    "src": "/images/gallery_8_1779379624217.png",
    "alt": "Large Luxury Estate Exterior",
    "caption": "Spacious Interiors · Delhi 2024"
  },
  {
    "id": "gallery-9",
    "src": "/images/gallery_9_1779379642249.png",
    "alt": "Residential Building Construction Site",
    "caption": "Luxury Estate · Noida 2023"
  }
];
