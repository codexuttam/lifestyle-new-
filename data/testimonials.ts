/** Client testimonials. Seeds the Firestore collection of the same name. */

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    "id": "rajesh-priya-malhotra",
    "name": "Rajesh & Priya Malhotra",
    "role": "Casa Meridian",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&h=250&q=80",
    "quote": "“The Premium Construction delivered our dream home exactly on time and within budget. The quality of the RCC structure and finishing is exceptional. Couldn't have asked for a better team.”"
  },
  {
    "id": "amit-sharma",
    "name": "Amit Sharma",
    "role": "Noida Sector 50",
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&h=250&q=80",
    "quote": "“From the first site visit to the final handover, every step was transparent and professional. Our 4BHK turned out better than we imagined.”"
  },
  {
    "id": "sanjay-verma",
    "name": "Sanjay Verma",
    "role": "The Ivory Residence",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=250&q=80",
    "quote": "“The dedicated site manager kept us updated daily. We were in Dubai during construction and had zero stress. Truly turnkey.”"
  },
  {
    "id": "neha-rohit-kapoor",
    "name": "Neha & Rohit Kapoor",
    "role": "DLF Phase 2, Delhi",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&h=250&q=80",
    "quote": "“Excellent material quality, no hidden costs, and a beautiful finish. The Premium Construction has set a new benchmark in Delhi NCR construction.”"
  },
  {
    "id": "vikram-nair",
    "name": "Vikram Nair",
    "role": "Sector 43, Gurugram",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&h=250&q=80",
    "quote": "“We compared 6 contractors before choosing The Premium Construction. Best decision we made. The 30-month warranty gave us complete peace of mind.”"
  }
];
