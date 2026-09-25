"use client";

import { useEffect, useState } from "react";
import { Table, Select, Button, Modal, Input, Form, message, Space, Tag } from "antd";
import { UserPlus, Trash2 } from "lucide-react";
import { useSession } from "@/components/useSession";
import { ROLE_LABELS } from "@/lib/roles";
import { appConfirmModal } from "@/lib/confirmModal";

type UserRow = { id: number; name: string; email: string; role: string; createdAt: string };

const ROLE_OPTIONS = ["super_admin", "admin", "staff", "user"].map((r) => ({
  value: r,
  label: ROLE_LABELS[r as keyof typeof ROLE_LABELS],
}));

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { email: myEmail } = useSession();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function changeRole(id: number, role: string) {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      message.success("Role updated.");
      load();
    } else {
      const data = await res.json();
      message.error(data.error || "Could not update role.");
    }
  }

  async function removeUser(id: number) {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      message.success("User removed.");
      load();
    } else {
      const data = await res.json();
      message.error(data.error || "Could not remove user.");
    }
  }

  async function createUser(values: { name: string; email: string; password: string; role: string }) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      message.error(data.error || "Could not create user.");
      return;
    }
    message.success("User created.");
    setModalOpen(false);
    form.resetFields();
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0 }}>Users &amp; Roles</h2>
          <p style={{ color: "#666", margin: "4px 0 0" }}>
            Super-admin only — grant staff and admin access without touching code.
          </p>
        </div>
        <Button type="primary" icon={<UserPlus size={15} />} onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={users}
        pagination={{ pageSize: 8 }}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Role",
            dataIndex: "role",
            render: (role: string, record: UserRow) =>
              record.email === myEmail ? (
                <Tag color="green">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]} (you)</Tag>
              ) : (
                <Select
                  size="small"
                  value={role}
                  options={ROLE_OPTIONS}
                  style={{ width: 140 }}
                  onChange={(v) =>
                    appConfirmModal({
                      title: "Change this user's role?",
                      content: `${record.name} will become ${ROLE_LABELS[v as keyof typeof ROLE_LABELS]}.`,
                      tone: "warning",
                      okText: "Change role",
                      onOk: () => changeRole(record.id, v),
                    })
                  }
                />
              ),
          },
          {
            title: "Actions",
            render: (_: unknown, record: UserRow) =>
              record.email === myEmail ? null : (
                <Space>
                  <Button
                    size="small"
                    danger
                    icon={<Trash2 size={13} />}
                    onClick={() =>
                      appConfirmModal({
                        title: "Remove this user?",
                        content: `${record.name} (${record.email}) will lose access to the dashboard.`,
                        tone: "danger",
                        okText: "Remove",
                        onOk: () => removeUser(record.id),
                      })
                    }
                  />
                </Space>
              ),
          },
        ]}
      />

      <Modal
        title="Add a user"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create user"
      >
        <Form form={form} layout="vertical" onFinish={createUser} initialValues={{ role: "staff" }}>
          <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Temporary password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
