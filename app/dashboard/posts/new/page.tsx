"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Button, message, Upload } from "antd";
import { ImagePlus } from "lucide-react";
import TiptapEditor from "@/components/TiptapEditor";

const CATEGORIES = ["Announcements", "Events", "Membership", "Funding", "Policy", "Training"];

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Announcements");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  async function uploadCover(file: File) {
    setUploadingCover(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploadingCover(false);
    if (res.ok) {
      setCoverImageUrl(data.url);
    } else {
      message.error(data.error || "Cover upload failed.");
    }
    return false; // prevent antd Upload's default xhr behaviour
  }

  async function save(publish: boolean) {
    if (!title || !excerpt || !content) {
      message.error("Title, excerpt and content are required.");
      return;
    }
    setSaving(publish ? "publish" : "draft");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, excerpt, coverImageUrl, contentHtml: content, publish }),
    });
    const data = await res.json();
    setSaving(null);
    if (!res.ok) {
      message.error(data.error || "Could not save post.");
      return;
    }
    message.success(publish ? "Post published." : "Draft saved.");
    router.push("/dashboard/posts");
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h2 style={{ marginTop: 0 }}>New Post</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 18 }}>
        <div>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Title</label>
          <Input size="large" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
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
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>
            Excerpt (shown on the blog list)
          </label>
          <Input.TextArea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={500} showCount />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Content</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Button loading={saving === "draft"} disabled={!!saving} onClick={() => save(false)}>
          Save as draft
        </Button>
        <Button type="primary" loading={saving === "publish"} disabled={!!saving} onClick={() => save(true)}>
          Publish
        </Button>
      </div>
    </div>
  );
}
