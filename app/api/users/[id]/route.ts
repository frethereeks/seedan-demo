import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/roles";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !can(session.role, "users_manage")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const { role } = body;
  if (!["super_admin", "admin", "staff", "user"].includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const targetId = Number(params.id);
  if (targetId === Number(session.sub) && role !== "super_admin") {
    return NextResponse.json({ error: "You cannot demote your own account." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: targetId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !can(session.role, "users_manage")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const targetId = Number(params.id);
  if (targetId === Number(session.sub)) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }
  await prisma.user.delete({ where: { id: targetId } });
  return NextResponse.json({ ok: true });
}
