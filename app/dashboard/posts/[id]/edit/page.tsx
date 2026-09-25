"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input, Select, Button, message, Upload, Spin } from "antd";
import { ImagePlus } from "lucide-react";
import TiptapEditor from "@/components/TiptapEditor";

const CATEGORIES = ["Announcements", "Events", "Membership", "Funding", "Policy", "Training"];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Announcements");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((post) => {
        setTitle(post.title);
        setCategory(post.category);
        setExcerpt(post.excerpt);
        setCoverImageUrl(post.coverImageUrl || "");
        setContent(post.contentHtml);
        setStatus(post.status);
        setLoading(false);
      });
  }, [id]);

  async function uploadCover(file: File) {
    setUploadingCover(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploadingCover(false);
    if (res.ok) setCoverImageUrl(data.url);
    else message.error(data.error || "Cover upload failed.");
    return false;
  }

  async function save(nextStatus: "draft" | "published") {
    setSaving(nextStatus === "published" ? "publish" : "draft");
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        excerpt,
        coverImageUrl,
        contentHtml: content,
        status: nextStatus,
      }),
    });
    const data = await res.json();
    setSaving(null);
    if (!res.ok) {
      message.error(data.error || "Could not save changes.");
      return;
    }
    message.success(nextStatus === "published" ? "Post published." : "Changes saved.");
    router.push("/dashboard/posts");
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h2 style={{ marginTop: 0 }}>Edit Post</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 18 }}>
        <div>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Title</label>
          <Input size="large" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Category</label>
            <Select
              size="large"
              style={{ width: "100%" }}
              value={category}
              onChange={setCategory}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Cover image</label>
            <Upload beforeUpload={uploadCover} showUploadList={false} accept="image/*">
              <Button icon={<ImagePlus size={14} />} loading={uploadingCover}>
                {coverImageUrl ? "Change cover" : "Upload cover"}
              </Button>
            </Upload>
          </div>
        </div>
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="Cover preview" style={{ maxWidth: 260, borderRadius: 8 }} />
        )}
        <div>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Excerpt</label>
          <Input.TextArea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={500} showCount />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Content</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Button loading={saving === "draft"} disabled={!!saving} onClick={() => save("draft")}>
          Save as draft
        </Button>
        <Button type="primary" loading={saving === "publish"} disabled={!!saving} onClick={() => save("published")}>
          {status === "published" ? "Update (published)" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
