"use client";

import { useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  ShieldCheck,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import type { Role } from "@/lib/roles";
import { ROLE_LABELS, can } from "@/lib/roles";

const { Sider, Header, Content } = Layout;

export default function DashboardShell({
  role,
  name,
  email,
  children,
}: {
  role: Role;
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { key: "/dashboard", icon: <LayoutDashboard size={16} />, label: <Link href="/dashboard">Overview</Link> },
    { key: "/dashboard/posts", icon: <Newspaper size={16} />, label: <Link href="/dashboard/posts">Blog Posts</Link> },
    ...(can(role, "members_view")
      ? [{ key: "/dashboard/members", icon: <Users size={16} />, label: <Link href="/dashboard/members">Membership</Link> }]
      : []),
    ...(can(role, "users_manage")
      ? [{ key: "/dashboard/users", icon: <ShieldCheck size={16} />, label: <Link href="/dashboard/users">Users &amp; Roles</Link> }]
      : []),
  ];

  const selectedKey =
    items
      .map((i) => i.key)
      .filter((k) => pathname === k || pathname.startsWith(k + "/"))
      .sort((a, b) => b.length - a.length)[0] || "/dashboard";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" width={230}>
        <div
          style={{
            padding: "18px 20px",
            fontWeight: 700,
            fontSize: collapsed ? 14 : 17,
            borderBottom: "1px solid #eee",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {collapsed ? "SP" : "SEEDAN Portal"}
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey]} items={items} style={{ borderRight: "none" }} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6 }}
          >
            <MenuIcon size={18} />
          </button>
          <Dropdown
            menu={{
              items: [
                { key: "logout", label: "Log out", icon: <LogOut size={14} />, onClick: logout },
              ],
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ textAlign: "right", lineHeight: 1.3 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 11.5, color: "#888" }}>{ROLE_LABELS[role]}</div>
              </div>
              <Avatar style={{ backgroundColor: "#5C7318" }}>{name.charAt(0).toUpperCase()}</Avatar>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24, background: "#f5f6f2" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
