"use client";

import { useEffect, useState } from "react";
import { Table, Button, Space, message, Modal, Input, Tabs } from "antd";
import { Check, X, Ban, RotateCcw } from "lucide-react";
import StatusTag from "@/components/StatusTag";
import { useSession } from "@/components/useSession";
import { appConfirmModal } from "@/lib/confirmModal";

type Member = {
  id: number;
  fullName: string;
  organizationName: string;
  email: string;
  phone: string;
  category: string;
  stateOfOperation: string;
  status: string;
  reviewNote: string | null;
  createdAt: string;
};

export default function DashboardMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const { role } = useSession();
  const canDecide = role === "super_admin" || role === "admin";

  async function load() {
    setLoading(true);
    const res = await fetch("/api/members");
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: number, status: string, promptNote = false) {
    let reviewNote: string | undefined;
    if (promptNote) {
      reviewNote = (await new Promise<string>((resolve) => {
        let value = "";
        Modal.confirm({
          title: status === "rejected" ? "Reason for rejection" : "Reason for suspension",
          content: (
            <Input.TextArea
              rows={3}
              placeholder="Shown to the member on their account page"
              onChange={(e) => (value = e.target.value)}
            />
          ),
          onOk: () => resolve(value),
          onCancel: () => resolve(""),
        });
      })) as string;
    }

    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewNote: reviewNote || undefined }),
    });
    if (res.ok) {
      message.success(`Application marked as ${status}.`);
      load();
    } else {
      const data = await res.json();
      message.error(data.error || "Could not update application.");
    }
  }

  const filtered = members.filter((m) => (tab === "all" ? true : m.status === tab));

  const columns = [
    { title: "Applicant", dataIndex: "fullName" },
    { title: "Organization", dataIndex: "organizationName" },
    { title: "Category", dataIndex: "category" },
    { title: "State", dataIndex: "stateOfOperation" },
    { title: "Email", dataIndex: "email" },
    { title: "Status", dataIndex: "status", render: (s: string) => <StatusTag status={s} /> },
    {
      title: "Actions",
      render: (_: unknown, record: Member) =>
        canDecide ? (
          <Space>
            {record.status !== "approved" && (
              <Button
                size="small"
                icon={<Check size={13} />}
                onClick={() =>
                  appConfirmModal({
                    title: "Approve this application?",
                    content: `${record.organizationName} will be granted an approved member account.`,
                    tone: "success",
                    okText: "Approve",
                    onOk: () => decide(record.id, "approved"),
                  })
                }
              >
                Approve
              </Button>
            )}
            {record.status !== "rejected" && (
              <Button
                size="small"
                danger
                icon={<X size={13} />}
                onClick={() =>
                  appConfirmModal({
                    title: "Reject this application?",
                    content: `${record.organizationName} will be notified that their application was rejected.`,
                    tone: "danger",
                    okText: "Reject",
                    onOk: () => decide(record.id, "rejected", true),
                  })
                }
              >
                Reject
              </Button>
            )}
            {record.status === "approved" && (
              <Button
                size="small"
                icon={<Ban size={13} />}
                onClick={() =>
                  appConfirmModal({
                    title: "Suspend this member?",
                    content: `${record.organizationName} will lose access until reactivated.`,
                    tone: "warning",
                    okText: "Suspend",
                    onOk: () => decide(record.id, "suspended", true),
                  })
                }
              >
                Suspend
              </Button>
            )}
            {record.status === "suspended" && (
              <Button
                size="small"
                icon={<RotateCcw size={13} />}
                onClick={() =>
                  appConfirmModal({
                    title: "Reactivate this member?",
                    content: `${record.organizationName} will regain approved member access.`,
                    tone: "success",
                    okText: "Reactivate",
                    onOk: () => decide(record.id, "approved"),
                  })
                }
              >
                Reactivate
              </Button>
            )}
          </Space>
        ) : (
          <span style={{ color: "#aaa", fontSize: 12.5 }}>View only</span>
        ),
    },
  ];

  return (
    <section className="bg-white drop-shadow-md rounded-xl p-3 sm:p-4 min-w-80 max-w-[calc(100vw-18px)] md:max-w-full space-y-4">
      <div className="scroll-m-0 overflow-hidden">
        <h2 style={{ marginTop: 0 }}>Membership</h2>
        <p style={{ color: "#666", marginBottom: 18 }} className="text-xs sm:text-sm">
          Review, approve, reject, or suspend membership applications submitted from the public site.
        </p>

        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            { key: "pending", label: `Pending (${members.filter((m) => m.status === "pending").length})` },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
            { key: "suspended", label: "Suspended" },
            { key: "all", label: "All" },
          ]}
        />
        <Table rowKey="id" loading={loading} dataSource={filtered} columns={columns} pagination={{
          hideOnSinglePage: true,
          pageSize: 50,
          showSizeChanger: false,
          showQuickJumper: false,
        }}
          showSorterTooltip
          scroll={{ x: 'max-content' }}
          style={{ minWidth: 350 }} />
      </div>
    </section>
  );
}
