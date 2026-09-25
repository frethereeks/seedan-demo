import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/roles";

export async function GET() {
  const session = await getSession();
  if (!session || !can(session.role, "members_view")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const members = await prisma.member.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(members);
}

// Public membership application (no auth required) — mirrors the concept
// note's "Membership Registration" requirement.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, organizationName, email, phone, category, stateOfOperation } = body;

  if (!fullName || !organizationName || !email || !phone || !category || !stateOfOperation) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const existing = await prisma.member.findUnique({ where: { email: String(email).toLowerCase().trim() } });
  if (existing) {
    return NextResponse.json(
      { error: "An application with this email already exists." },
      { status: 409 }
    );
  }

  const member = await prisma.member.create({
    data: {
      fullName,
      organizationName,
      email: String(email).toLowerCase().trim(),
      phone,
      category,
      stateOfOperation,
      status: "pending",
    },
  });

  return NextResponse.json(member, { status: 201 });
}
