import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StatusTag from "@/components/StatusTag";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await getSession();
  const member = session
    ? await prisma.member.findUnique({ where: { userId: Number(session.sub) } })
    : null;

  return (
    <>
      <div className="container">
        <SiteHeader />
      </div>
      <div className="container" style={{ maxWidth: 640, padding: "48px 24px 80px" }}>
        <h1 style={{ marginBottom: 4 }}>Welcome, {session?.name}</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
          This is your member account area — a simplified space for regular members, separate from
          the staff/admin dashboard.
        </p>

        <div className="sidebar-card" style={{ marginBottom: 20 }}>
          <h4>Membership status</h4>
          {member ? (
            <>
              <p style={{ margin: "0 0 10px" }}>
                <StatusTag status={member.status} />
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>
                <strong>{member.organizationName}</strong> — {member.category}, {member.stateOfOperation}
              </p>
              {member.reviewNote && (
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 10 }}>
                  Note from SEEDAN: {member.reviewNote}
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: 14.5 }}>
              No membership application on file yet.{" "}
              <Link href="/apply" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                Apply now
              </Link>
              .
            </p>
          )}
        </div>

        <Link href="/blog" style={{ color: "var(--accent)", textDecoration: "underline", fontSize: 14 }}>
          Browse the SEEDAN blog →
        </Link>
      </div>
    </>
  );
}
