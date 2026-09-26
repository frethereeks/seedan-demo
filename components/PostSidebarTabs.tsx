"use client";

import { useState } from "react";
import Link from "next/link";

type SidebarPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  coverImageUrl: string | null;
  publishedAt: string | Date | null;
  author: { name: string };
};

export default function PostSidebarTabs({
  popular,
  latest,
}: {
  popular: SidebarPost[];
  latest: SidebarPost[];
}) {
  const [tab, setTab] = useState<"popular" | "latest">("popular");
  const posts = tab === "popular" ? popular : latest;

  return (
    <div className="sidebar-card">
      <div className="sidebar-tabs">
        <button type="button" className={tab === "popular" ? "active" : ""} onClick={() => setTab("popular")}>
          Popular
        </button>
        <button type="button" className={tab === "latest" ? "active" : ""} onClick={() => setTab("latest")}>
          Latest
        </button>
      </div>
      {posts.length === 0 && (
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", paddingTop: 14 }}>Nothing here yet.</p>
      )}
      {posts.map((p) => (
        <div className="item" key={p.id}>
          <Link href={`/blog/${p.slug}`} className="item-thumb">
            {p.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.coverImageUrl} alt={p.title} />
            ) : (
              p.category.slice(0, 2)
            )}
          </Link>
          <div className="item-body">
            <div className="item-meta">
              {p.publishedAt &&
                new Date(p.publishedAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
              &middot; {p.category}
            </div>
            <Link href={`/blog/${p.slug}`} className="item-title">
              {p.title}
            </Link>
            <div className="item-author">{p.author.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
