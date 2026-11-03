import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INITIAL_BLOGS } from "@/lib/services/blogGeneratorService";
import { getSettings } from "@/lib/content/settings";
import BlogArticleClient from "./BlogArticleClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return INITIAL_BLOGS.map((blog) => ({
    id: blog.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = INITIAL_BLOGS.find((b) => b.id === id);

  if (!blog) {
    return {
      title: "Journal Article | Lifestyle Home Spaces & Aura",
      description: "Editorial perspectives on luxury real estate, architecture, and living in Amravati.",
    };
  }

  return {
    title: `${blog.title} | Lifestyle Journal`,
    description: blog.excerpt,
    alternates: { canonical: `/blogs/${blog.id}` },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [{ url: blog.image }],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const settings = await getSettings();
  const initialBlog = INITIAL_BLOGS.find((b) => b.id === id) || null;

  return (
    <BlogArticleClient
      id={id}
      initialBlog={initialBlog}
      settings={settings}
      allInitialBlogs={INITIAL_BLOGS}
    />
  );
}
