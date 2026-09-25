import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/roles";

async function loadPost(id: number) {
  return prisma.post.findUnique({ where: { id } });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await loadPost(Number(params.id));
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const post = await loadPost(Number(params.id));
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const isOwner = post.authorId === Number(session.sub);
  const canEditAny = can(session.role, "posts_edit_any");
  if (!isOwner && !canEditAny) {
    return NextResponse.json({ error: "Not authorized to edit this post." }, { status: 403 });
  }

  const body = await req.json();
  const { title, category, excerpt, coverImageUrl, contentHtml, status } = body;

  let nextStatus = post.status;
  if (status === "published") {
    if (!can(session.role, "posts_publish")) {
      return NextResponse.json({ error: "Not authorized to publish." }, { status: 403 });
    }
    nextStatus = "published";
  } else if (status === "draft") {
    nextStatus = "draft";
  }

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: {
      title: title ?? post.title,
      category: category ?? post.category,
      excerpt: excerpt ?? post.excerpt,
      coverImageUrl: coverImageUrl ?? post.coverImageUrl,
      contentHtml: contentHtml ?? post.contentHtml,
      status: nextStatus,
      publishedAt:
        nextStatus === "published" && !post.publishedAt ? new Date() : post.publishedAt,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !can(session.role, "posts_delete")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  await prisma.post.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
