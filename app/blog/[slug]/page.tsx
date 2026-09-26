import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Share2, Heart, ChevronRightIcon } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PostSidebarTabs from "@/components/PostSidebarTabs";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post || post.status !== "published") {
    return { title: "Post not found" };
  }
  const description = post.excerpt;
  const image = post.coverImageUrl || "/og-image.jpg";

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const [popular, latest] = await Promise.all([
    prisma.post.findMany({
      where: { status: "published", id: { not: post!.id } },
      orderBy: { publishedAt: "desc" },
      take: 4,
      include: { author: { select: { name: true } } },
    }),
    prisma.post.findMany({
      where: { status: "published", id: { not: post!.id } },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { author: { select: { name: true } } },
    }),
  ]);

  const initials = post!.author.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="container">
        <SiteHeader />
      </div>
      <div className="post-hero">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link> <ChevronRightIcon size={10}/> <Link href="/blog">Blog</Link> <ChevronRightIcon size={10}/>{" "}
            {post!.title}
          </div>
          <h1>{post!.title}</h1>
        </div>
      </div>
      <div className="post-content-bg">
        <div className="container">
          <div className="post-layout">
            <div>
              <div className="post-meta">
                {post!.publishedAt && formatDate(post!.publishedAt)} &middot; {post!.category}
              </div>
              <h2 className="post-article-title">{post!.title}</h2>

              <div className="post-hero-image">
                {post!.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post!.coverImageUrl} alt={post!.title} />
                ) : null}
              </div>

              <div className="post-byline">
                <div className="author">
                  <div className="avatar">{initials}</div>
                  <span>{post!.author.name}</span>
                </div>
                <div className="icon-group">
                  <button type="button" className="icon-btn" title="Share">
                    <Share2 size={15} />
                  </button>
                  <button type="button" className="icon-btn" title="Save">
                    <Heart size={15} />
                  </button>
                </div>
              </div>

              <div className="post-content" dangerouslySetInnerHTML={{ __html: post!.contentHtml }} />
            </div>
            <aside>
              <PostSidebarTabs
                popular={popular.map((p) => ({ ...p, publishedAt: p.publishedAt }))}
                latest={latest.map((p) => ({ ...p, publishedAt: p.publishedAt }))}
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
