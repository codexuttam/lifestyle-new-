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
    id: "neha-rohit-kapoor",
    name: "Neha & Rohit Kapoor",
    role: "Camp Road, Amravati",
    avatar: "/testimonials/indian_couple.jpg",
    quote: "“Excellent material quality, no hidden costs, and a breathtaking finish. Lifestyle Home Spaces has set a new benchmark in Amravati’s luxury residential living.”",
  },
  {
    id: "dr-amit-deshmukh",
    name: "Dr. Amit & Priya Deshmukh",
    role: "Parvati Nagar, Amravati",
    avatar: "/testimonials/indian_doctor.jpg",
    quote: "“From the first site inspection on DPS Road to the key handover, every step was transparent and professional. The 100% Vastu layout and ventilation are truly exceptional.”",
  },
  {
    id: "priya-agrawal",
    name: "Priya & Rajesh Agrawal",
    role: "Congress Nagar, Amravati",
    avatar: "/testimonials/indian_businesswoman.jpg",
    quote: "“The quality of the RCC structure, Jaquar bath fittings, and double-height lobbies exceeded our expectations. Best residential investment in Amravati.”",
  },
  {
    id: "rajesh-mishra",
    name: "Rajesh Mishra & Family",
    role: "Rajapeth Avenue, Amravati",
    avatar: "/testimonials/indian_senior.jpg",
    quote: "“We inspected multiple developers in Amravati before choosing Lifestyle. The dual Otis elevators and generator backup give complete peace of mind to our family.”",
  },
  {
    id: "vikram-kothari",
    name: "Vikram Kothari",
    role: "Badnera Road, Amravati",
    avatar: "/testimonials/indian_tech.jpg",
    quote: "“The commercial showrooms and residential suites are planned to perfection. 24-metre DPS road frontage and high footfall make it unbeatable in Amravati.”",
  },
];
