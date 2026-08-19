/** Frequently asked questions. Seeds the Firestore collection of the same name. */

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export const FAQS: FaqEntry[] = [
  {
    "id": "what-types-of-homes-do",
    "question": "What types of homes do you build?",
    "answer": "We build turnkey residential projects across Delhi NCR — independent houses, villas and bungalows, plus renovations and floor additions on existing plots. Every build is engineered to IS code with premium TMT steel and M25 concrete."
  },
  {
    "id": "how-does-the-construction-process",
    "question": "How does the construction process work?",
    "answer": "It runs in six stages: site visit and assessment, design and planning, contract and municipal approvals, foundation and structure, finishing and interiors, then handover. You get a fixed-price contract up front and a dedicated site manager throughout."
  },
  {
    "id": "can-i-schedule-a-site",
    "question": "Can I schedule a site visit?",
    "answer": "Yes. Call or WhatsApp us and we will visit your plot to study orientation, soil and surroundings, then walk you through what is feasible and what it will cost — before you commit to anything."
  },
  {
    "id": "do-you-handle-approvals-and",
    "question": "Do you handle approvals and provide a warranty?",
    "answer": "We handle municipal approvals as part of the contract, and every build carries a 30-month structural warranty. Final walkthrough and snagging are cleared before we hand over the keys."
  }
];
