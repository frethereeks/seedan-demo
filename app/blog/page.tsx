import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, events, and resources for the Seed Entrepreneurs Association of Nigeria — published straight from the SEEDAN dashboard.",
  openGraph: {
    title: "SEEDAN Blog",
    description:
      "News, events, and resources for the Seed Entrepreneurs Association of Nigeria — published straight from the SEEDAN dashboard.",
  },
};

export default async function BlogListPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <div className="container">
        <SiteHeader />
      </div>
      <div className="blog-page-bg">
        <div className="blog-hero">
          <div className="container">
            <h1>Our Inspirational Articles</h1>
            <p>
              Immerse yourself in inspiration and expert insights with our blog section, offering a
              deep dive into news and updates for the SEEDAN community.
            </p>
          </div>
        </div>
        <div className="container">
          {posts.length === 0 ? (
            <p style={{ color: "var(--ink-soft)", padding: "0 0 60px" }}>
              No posts published yet — check back soon.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="thumb">
                      {post.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverImageUrl} alt={post.title} />
                      ) : (
                        post.category
                      )}
                    </div>
                  </Link>
                  <div className="body">
                    <div className="category">{post.category}</div>
                    <h3>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <Link href={`/blog/${post.slug}`} className="read-more">
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
