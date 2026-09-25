import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/roles";

const VALID_TRANSITIONS = ["pending", "approved", "rejected", "suspended"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !can(session.role, "members_decide")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const { status, reviewNote } = body;

  if (!VALID_TRANSITIONS.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const member = await prisma.member.update({
    where: { id: Number(params.id) },
    data: { status, reviewNote: reviewNote ?? undefined },
  });

  return NextResponse.json(member);
}
