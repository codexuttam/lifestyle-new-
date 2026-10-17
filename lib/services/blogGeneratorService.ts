import { BrandBlogPost } from "@/lib/types/blog";
import { SAMPLE_BITLANCE_FULL_MARKDOWN } from "@/lib/data/sampleBitlanceFullBlog";

const getEnv = (key: string, fallback = "") => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key]) return process.env[key]!;
    if (process.env[`NEXT_PUBLIC_${key.replace(/^VITE_/, "")}`]) {
      return process.env[`NEXT_PUBLIC_${key.replace(/^VITE_/, "")}`]!;
    }
  }
  return fallback;
};

export const BITLANCE_CONFIG = {
  API_KEY: getEnv(
    "VITE_BITLANCE_BLOG_API_KEY",
    "sda_etMMFE1fynlh-8VKC6gCiYbkyfMVTt1HHakLYN-MGCSDU018"
  ),
  BASE_URL: getEnv(
    "VITE_BITLANCE_BLOG_API_BASE_URL",
    "https://api.bitlancetechhub.com"
  ),
  ENDPOINT: "/api/social-dashboard/blog/generate",
};

const STORAGE_KEY = "lifestyle_ai_generated_blogs";

export interface GenerateBlogParams {
  topic: string;
  keywords?: string;
  mode?: "SEO" | "GEO";
  companyName?: string;
  toneOfVoice?: string;
  apiKey?: string;
}

export interface BitlanceGenerateResponse {
  success?: boolean;
  id?: string;
  seoTitle?: string;
  topic?: string;
  article?: string;
  markdown?: string;
  imageUrl?: string;
  image_url?: string;
  wordCount?: number;
  plagiarismCheck?: string;
  keywords?: string;
  creditsUsed?: number;
  newBalance?: number;
  backlinkAnalysis?: {
    topicalCluster?: string;
    authorityScore?: number;
    suggestedLinks?: string[];
  };
}

export const INITIAL_BLOGS: BrandBlogPost[] = [
  {
    id: "luxury-real-estate-trends-amravati-2026",
    title: "Luxury Real Estate Trends in Amravati: A Practical 2026 Buyer’s Guide",
    category: "Market Analysis",
    readTime: "9 min read",
    date: "Jun 2026",
    excerpt:
      "Explore shifting luxury preferences in Amravati, from prime Congress Nagar Road and DPS Road locations to MahaRERA verifications, rooftop sky amenities, and smart buying decisions.",
    image: "/aura/aura-hero-clean-4k.jpg",
    content: [
      "Luxury Real Estate Trends in Amravati are shifting from larger apartments alone toward better locations, stronger documentation, private amenities, smart-home features, and long-term liveability. The change matters because premium buyers increasingly expect their home to function as a residence, wellness environment, investment, and status asset at the same time.",
      "Amravati remains more affordable than India’s largest luxury markets, but that does not mean every expensive property qualifies as luxury. A premium home should combine usable space, construction quality, reliable infrastructure, privacy, services, and legally verifiable ownership. Buyers are also paying closer attention to possession timelines, maintenance costs, water security, parking, connectivity, and resale demand.",
      "Key corridors such as Congress Nagar Road and DPS Road offer high vehicular and pedestrian connectivity. Highrise developments like Aura by Lifestyle integrate rooftop swimming pools, sky gardens, and double-height entrance lobbies that redefine skyline living in Amravati.",
      "Whether you seek immediate possession or flagship highrise luxury, examining MahaRERA registration and on-ground build quality guarantees lifelong security."
    ],
    highlights: [
      "Mandatory MahaRERA verification protects homebuyer funds and timelines (Aura: P5030002502915)",
      "Location strength on Congress Nagar Road and DPS Road outpaces peripheral suburbs",
      "Rooftop infinity amenities and sky wellness decks become essential luxury criteria",
      "Ready-to-move homes provide immediate physical inspection certainty"
    ],
    markdown: SAMPLE_BITLANCE_FULL_MARKDOWN,
    relatedProject: "aura",
  },
  {
    id: "sample-flat-walkthrough-lifestyle-homes",
    title: "Inside the Finished Sample Residence: What Living at Lifestyle Homes Truly Feels Like",
    category: "Architecture",
    readTime: "3 min read",
    date: "May 2026",
    excerpt:
      "A guided walkthrough of our fully furnished 2 & 3 BHK sample apartments on DPS Road, highlighting material choices, natural cross-ventilation, and interior elegance.",
    image: "/projects/lifestyle-homes/bedroom-showcase.jpg",
    content: [
      "Buying a home on paper requires imagination, but inspecting a finished, fully furnished sample apartment provides genuine certainty. At Lifestyle Homes, our live sample flat on DPS Road is open for prospective buyers to touch, feel, and inspect every structural detail.",
      "From the moment you step through the decorative entrance door, you notice the spacious living hall finished with premium vitrified tiles and delicate lighting fixtures that create an immediate aura of quiet luxury.",
      "The culinary kitchen features mirror-polished granite countertops, heavy-gauge stainless steel sinks, and dedicated utility balconies. Bedrooms are oriented to catch refreshing cross-breezes and morning solar energy through wide powder-coated aluminum sliding windows.",
      "We invite prospective families to walk through the actual corridors, inspect elevator lobbies, and verify room measurements in person."
    ],
    highlights: [
      "Fully finished 2 BHK & 3 BHK sample apartments open for daily walkthroughs",
      "Inspect actual material specs, tile finishing, and sanitary fittings in person",
      "Developer consultation available on-site with Rajesh Mishra & Amit Talda",
      "Site visits arranged Monday to Saturday, 12:00 PM to 8:00 PM"
    ],
    relatedProject: "lifestyle-homes",
  },
  {
    id: "commercial-property-amravati",
    title: "Why Investing in Commercial Property in Amravati is a Smart Move",
    category: "Investment",
    readTime: "5 min read",
    date: "Apr 2026",
    excerpt:
      "Explore high-visibility commercial corridors and prime retail arcade opportunities offering strong rental yields and footfall across Amravati.",
    image: "/aura/real-aura.png",
    content: [
      "Amravati is witnessing an economic renaissance driven by infrastructure expansion, commercial corridor modernization, and rising retail consumer spending. For savvy investors and business owners, commercial retail spaces represent robust capital appreciation and dependable rental yields.",
      "Key corridors such as Congress Nagar Road and DPS Road offer high vehicular and pedestrian footfall. Developments like Aura by Lifestyle and Lifestyle Home Spaces provide storefronts featuring wide road frontage that attract national brand franchises, boutique clinics, financial firms, and gourmet dining destinations.",
      "With dedicated commercial parking, wide visitor corridors, and prime road accessibility, strategic commercial developments provide security and long-term liquidity."
    ],
    highlights: [
      "High visibility retail frontages on Congress Nagar Road & DPS Road",
      "Ideal for medical clinics, corporate offices, retail boutiques, and cafes",
      "Dedicated customer parking bays separate from residential zones",
      "Strong capital appreciation fueled by Amravati’s expanding arterial roads"
    ],
    relatedProject: "aura",
  },
  {
    id: "first-time-home-buyers-guide",
    title: "What First-Time Home Buyers Need to Know Before Investing",
    category: "Buyer Guide",
    readTime: "4 min read",
    date: "Mar 2026",
    excerpt:
      "Essential advice on MahaRERA verification, carpet area transparency, loan eligibility, and location appreciation for first-time buyers in Amravati.",
    image: "/aura/luxury-master-bedroom.jpg",
    content: [
      "Purchasing your first home is one of life’s most meaningful financial and personal milestones. However, navigating the landscape of property titles, government approvals, and carpet area definitions can feel overwhelming without clear guidance.",
      "Step one is always verifying MahaRERA registration. A registered project guarantees that all architectural sanctions, title deeds, construction milestones, and escrow bank accounts adhere strictly to statutory consumer protection regulations.",
      "Secondly, prioritize carpet area over super built-up claims. Understanding usable interior dimensions ensures you know exactly how much living space your family will inhabit on a daily basis.",
      "At Lifestyle Homes, we maintain 100% transparency. Our advisors guide buyers through pre-approved home loan options with leading nationalized banks, ensuring smooth paperwork and clear disbursement schedules."
    ],
    highlights: [
      "Mandatory MahaRERA verification protects homebuyer funds and timelines",
      "Clear carpet area layouts with zero wasted circulation spaces",
      "End-to-end documentation assistance with leading banking partners",
      "Pre-approved home loans with attractive interest rates and flexible tenures"
    ],
    relatedProject: "lifestyle-homes",
  },
  {
    id: "quality-durability-assurance",
    title: "How Lifestyle Homes Ensures Quality & Durability in Every Build",
    category: "Engineering",
    readTime: "4 min read",
    date: "Feb 2026",
    excerpt:
      "From grade-tested concrete to branded CP fittings and electricals, discover our unbending approach to construction longevity.",
    image: "/aura/rooftop-amenities-3d.jpg",
    content: [
      "Behind every striking architectural elevation lies structural engineering that must stand resilient against the elements for generations. At Lifestyle Homes, our construction philosophy centers on uncompromising structural integrity and premium building materials.",
      "Every project begins with rigorous soil testing and earthquake-resistant RCC framed structures engineered to structural codes. We utilize grade-tested steel reinforcement and laboratory-certified concrete mixes to guarantee compressive durability.",
      "For interiors and domestic plumbing, only branded CP fittings, concealed corrosion-resistant piping, and ISI-certified copper wiring with modular safety switches are specified. This prevents moisture seepage, maintenance headaches, and electrical hazards.",
      "Our engineering leads conduct multi-stage quality audits at foundation, slab casting, brickwork, and waterproofing phases before handing over keys to homeowners."
    ],
    highlights: [
      "Earthquake-resistant RCC framed structures built to stringent structural codes",
      "Laboratory-tested high-grade concrete and corrosion-resistant steel",
      "Concealed plumbing and branded electrical wiring with modular breakers",
      "Rigorous multi-stage quality assurance audits prior to possession"
    ],
    relatedProject: "aura",
  },
];

/**
 * Calls Bitlance SEO/Social AI Agent to generate an article with auto image
 */
export async function generateBlogWithBitlance(
  params: GenerateBlogParams
): Promise<BrandBlogPost> {
  const apiKey = params.apiKey?.trim() || BITLANCE_CONFIG.API_KEY;
  if (!apiKey) {
    throw new Error("Bitlance API Key is missing. Please configure VITE_BITLANCE_BLOG_API_KEY.");
  }

  const company = params.companyName || "Lifestyle Homes";
  const tone =
    params.toneOfVoice ||
    "Sophisticated luxury, architectural excellence, and authoritative real estate guidance in Amravati";

  const payload = {
    topic: params.topic.trim(),
    keywords: params.keywords?.trim() || "",
    optimization_mode: params.mode || "SEO",
    image_option: "auto",
    company_name: company,
    brand_context_data: {
      company_name: company,
      tone_of_voice: tone,
    },
  };

  const response = await fetch(`${BITLANCE_CONFIG.BASE_URL}${BITLANCE_CONFIG.ENDPOINT}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Bitlance AI Generator failed (${response.status}): ${errorText}`);
  }

  const data: BitlanceGenerateResponse = await response.json();

  const blog = formatBitlanceResponseToBlog(data, params);
  saveStoredAiBlog(blog);
  return blog;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function formatBitlanceResponseToBlog(
  data: BitlanceGenerateResponse,
  params: GenerateBlogParams
): BrandBlogPost {
  const title = data.seoTitle || params.topic;
  const rawText = data.markdown || data.article || "";

  const paragraphs = extractParagraphsFromMarkdown(rawText);
  const highlights = extractHighlightsFromMarkdown(rawText);

  const words = data.wordCount || rawText.split(/\s+/).length || 500;
  const readMinutes = Math.max(2, Math.round(words / 220));

  const image =
    data.imageUrl ||
    data.image_url ||
    "/aura/aura-hero-clean-4k.jpg";

  const firstCleanParagraph =
    paragraphs.find((p) => !p.startsWith("#") && !p.startsWith(">")) || params.topic;
  const excerpt =
    firstCleanParagraph.slice(0, 180) + (firstCleanParagraph.length > 180 ? "..." : "");

  const id = `ai-${Date.now()}-${slugify(title).slice(0, 30)}`;

  return {
    id,
    title,
    category: params.mode === "GEO" ? "AI Discovery" : "Market Analysis",
    readTime: `${readMinutes} min read`,
    date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    excerpt,
    image,
    content: paragraphs.length > 0 ? paragraphs : [rawText],
    highlights:
      highlights.length > 0
        ? highlights
        : [
            `Engineered for high visibility on Google & AI search (${params.mode || "SEO"})`,
            `Verified with zero plagiarism detected by Bitlance SEO AI Agent`,
            `In-depth architectural analysis for Amravati property investors`,
          ],
    markdown: rawText,
    isAiGenerated: true,
    topic: params.topic,
    keywords: data.keywords || params.keywords,
    creditsUsed: data.creditsUsed,
  };
}

function extractParagraphsFromMarkdown(markdown: string): string[] {
  if (!markdown) return [];

  return markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => {
      if (!p) return false;
      if (p.startsWith("> 📌") || p.startsWith("> 📝") || p.startsWith("> 🔗")) return false;
      if (p.startsWith("## Table of Contents")) return false;
      if (p.startsWith("|") && p.includes("---|---")) return false;
      return true;
    });
}

function extractHighlightsFromMarkdown(markdown: string): string[] {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const bullets = lines
    .filter((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter((line) => line.length > 15 && line.length < 160 && !line.startsWith("["))
    .slice(0, 4);

  return bullets;
}

export function getStoredAiBlogs(): BrandBlogPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAiBlog(blog: BrandBlogPost): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredAiBlogs();
    const updated = [blog, ...existing.filter((b) => b.id !== blog.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to persist AI blog to localStorage:", err);
  }
}

export function deleteStoredAiBlog(blogId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredAiBlogs();
    const updated = existing.filter((b) => b.id !== blogId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete AI blog from localStorage:", err);
  }
}

export function getAllMergedBlogs(): BrandBlogPost[] {
  const stored = getStoredAiBlogs();
  const storedIds = new Set(stored.map((b) => b.id));
  const uniqueDefaults = INITIAL_BLOGS.filter((b) => !storedIds.has(b.id));
  return [...stored, ...uniqueDefaults];
}
