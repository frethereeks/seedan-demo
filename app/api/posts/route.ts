import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/roles";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const publicOnly = req.nextUrl.searchParams.get("public") === "1";

  if (publicOnly || !session) {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(posts);
  }

  // Dashboard view: staff see their own posts, admin/super_admin see all.
  const where = can(session.role, "posts_edit_any") ? {} : { authorId: Number(session.sub) };
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !can(session.role, "posts_create")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const { title, category, excerpt, coverImageUrl, contentHtml, publish } = body;

  if (!title || !category || !excerpt || !contentHtml) {
    return NextResponse.json({ error: "Title, category, excerpt and content are required." }, { status: 400 });
  }

  let slug = slugify(title);
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const wantsPublish = !!publish && can(session.role, "posts_publish");

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      category,
      excerpt,
      coverImageUrl: coverImageUrl || null,
      contentHtml,
      status: wantsPublish ? "published" : "draft",
      authorId: Number(session.sub),
      publishedAt: wantsPublish ? new Date() : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
