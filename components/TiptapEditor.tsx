"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  VideoIcon,
  Undo,
  Redo,
  LayoutGrid,
} from "lucide-react";
import { message, Dropdown } from "antd";
import { ImageGrid } from "./ImageGridExtension";

// A small custom node view isn't necessary for single images/video — those
// embed as plain <img>/<video> tags, which Tiptap's StarterKit (with HTML
// parsing) round-trips fine for read + re-edit. Multi-column image rows use
// a dedicated node (ImageGrid, see ./ImageGridExtension) since each cell
// needs its own upload/replace control.

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your post..." }),
      ImageGrid,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "ProseMirror" },
    },
  });

  const uploadFile = useCallback(
    async (file: File, kind: "image" | "video") => {
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) {
          message.error(data.error || "Upload failed.");
          return;
        }
        if (kind === "image") {
          editor?.chain().focus().setImage({ src: data.url }).run();
        } else {
          editor
            ?.chain()
            .focus()
            .insertContent(`<video src="${data.url}" controls style="max-width:100%;border-radius:6px;"></video>`)
            .run();
        }
      } catch {
        message.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [editor]
  );

  if (!editor) return null;

  const btn = (active: boolean) => `${active ? "is-active" : ""}`;

  return (
    <div>
      <div className="editor-toolbar">
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </button>
        <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={15} />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={15} />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={15} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={15} />
        </button>
        <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={15} />
        </button>
        <button type="button" disabled={uploading} onClick={() => videoInputRef.current?.click()}>
          <VideoIcon size={15} />
        </button>
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "2", label: "2 columns" },
              { key: "3", label: "3 columns" },
              { key: "4", label: "4 columns" },
            ],
            onClick: ({ key }) => editor.chain().focus().insertImageGrid(Number(key)).run(),
          }}
        >
          <button type="button" title="Insert a multi-column image row">
            <LayoutGrid size={15} />
          </button>
        </Dropdown>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </button>
        {uploading && <span style={{ fontSize: 12, color: "#888", alignSelf: "center", marginLeft: 6 }}>Uploading...</span>}
      </div>
      <div className="tiptap-body">
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file, "image");
          e.target.value = "";
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file, "video");
          e.target.value = "";
        }}
      />
    </div>
  );
}
