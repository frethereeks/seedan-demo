"use client";

import { useEffect, useState } from "react";
import { Table, Button, message, Space } from "antd";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import StatusTag from "@/components/StatusTag";
import { appConfirmModal } from "@/lib/confirmModal";

type Post = {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  createdAt: string;
  author: { name: string };
};

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      message.success("Post deleted.");
      load();
    } else {
      message.error("Could not delete post.");
    }
  }

  return (
    <section className="bg-white drop-shadow-md rounded-xl p-3 sm:p-4 min-w-80 max-w-[calc(100vw-18px)] md:max-w-full space-y-4">
      <div className="scroll-m-0 overflow-hidden">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0 }}>Blog Posts</h2>
            <p style={{ color: "#666", margin: "4px 0 0" }}>Create, edit, and publish content for the public blog.</p>
          </div>
          <Link href="/dashboard/posts/new">
            <Button type="primary" icon={<Plus size={15} />}>
              New Post
            </Button>
          </Link>
        </div>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={posts}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 50,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          showSorterTooltip
          scroll={{ x: 'max-content' }}
          columns={[
            { title: "Title", dataIndex: "title" },
            { title: "Category", dataIndex: "category" },
            { title: "Author", dataIndex: ["author", "name"] },
            {
              title: "Status",
              dataIndex: "status",
              render: (status: string) => <StatusTag status={status} />,
            },
            {
              title: "Created",
              dataIndex: "createdAt",
              render: (d: string) => new Date(d).toLocaleDateString(),
            },
            {
              title: "Actions",
              render: (_: unknown, record: Post) => (
                <Space>
                  {record.status === "published" && (
                    <Link href={`/blog/${record.slug}`} target="_blank">
                      <Button size="small" icon={<Eye size={13} />} />
                    </Link>
                  )}
                  <Link href={`/dashboard/posts/${record.id}/edit`}>
                    <Button size="small" icon={<Pencil size={13} />} />
                  </Link>
                  <Button
                    size="small"
                    danger
                    icon={<Trash2 size={13} />}
                    onClick={() =>
                      appConfirmModal({
                        title: "Delete this post?",
                        content: `"${record.title}" will be permanently deleted. This can't be undone.`,
                        tone: "danger",
                        okText: "Delete",
                        onOk: () => remove(record.id),
                      })
                    }
                  />
                </Space>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
