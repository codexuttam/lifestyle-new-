export interface BrandBlogPost {
  id: string;
  title: string;
  category: string;
  date?: string;
  readTime?: string;
  excerpt: string;
  image: string;
  content: string[];
  highlights: string[];
  relatedProject?: string;
  markdown?: string;
  isAiGenerated?: boolean;
  topic?: string;
  keywords?: string;
  creditsUsed?: number;
}
