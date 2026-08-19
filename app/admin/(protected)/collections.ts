import type { SimpleField } from "./SimpleForm";

/** Field definitions for the flat collections driven by SimpleForm. */
export const SIMPLE_COLLECTIONS: Record<
  string,
  { title: string; intro: string; idSourceKey: string; fields: SimpleField[] }
> = {
  testimonials: {
    title: "Testimonials",
    intro: "Shown in the homepage marquee, in this order.",
    idSourceKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text", full: false },
      {
        key: "role",
        label: "Project or location",
        type: "text",
        full: false,
      },
      {
        key: "avatar",
        label: "Photo",
        type: "media",
        folder: "people",
        hint: "Square works best — it is cropped to a circle.",
      },
      {
        key: "quote",
        label: "Quote",
        type: "textarea",
        hint: "Include the surrounding quotation marks.",
      },
    ],
  },
  faqs: {
    title: "FAQs",
    intro: "Answers shown in the accordion, in this order.",
    idSourceKey: "question",
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
    ],
  },
  gallery: {
    title: "Gallery",
    intro: "Photographs of completed work.",
    idSourceKey: "caption",
    fields: [
      { key: "src", label: "Image", type: "media", folder: "gallery" },
      {
        key: "alt",
        label: "Alt text",
        type: "text",
        hint: "Describes the image for screen readers and search engines.",
      },
      { key: "caption", label: "Caption", type: "text" },
    ],
  },
};
