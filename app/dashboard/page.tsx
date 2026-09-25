import { Card, Col, Row, Statistic } from "antd";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await getSession();
  const role = session!.role;

  const [publishedCount, draftCount, pendingMembers, totalMembers] = await Promise.all([
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.member.count({ where: { status: "pending" } }),
    prisma.member.count(),
  ]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Overview</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Welcome back, {session!.name}. Here's what's happening on the SEEDAN portal.
      </p>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Link href="/dashboard/posts">
            <Card>
              <Statistic title="Published Posts" value={publishedCount} valueStyle={{ color: "#5C7318" }} />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Link href="/dashboard/posts">
            <Card>
              <Statistic title="Draft Posts" value={draftCount} />
            </Card>
          </Link>
        </Col>
        {can(role, "members_view") && (
          <>
            <Col xs={24} sm={12} lg={6}>
              <Link href="/dashboard/members">
                <Card>
                  <Statistic title="Pending Applications" value={pendingMembers} valueStyle={{ color: "#d48806" }} />
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Link href="/dashboard/members">
                <Card>
                  <Statistic title="Total Members" value={totalMembers} />
                </Card>
              </Link>
            </Col>
          </>
        )}
      </Row>

      <Card style={{ marginTop: 24 }} title="About this demo">
        <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>
          This is a working slice of the platform proposed for SEEDAN — built to show that everyday
          administration (publishing news, reviewing membership applications, managing staff access)
          needs no developer, just a browser. Your role (<strong>{role}</strong>) determines exactly
          what you can see and do here, matching the access-control model in the proposal.
        </p>
      </Card>
    </div>
  );
}
