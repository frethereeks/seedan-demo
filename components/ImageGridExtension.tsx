"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useRef, useState } from "react";
import { ImagePlus, X, RefreshCw, Trash2 } from "lucide-react";
import { message } from "antd";

// A multi-column image row: 2, 3 or 4 images laid out side by side inside
// the post body. Renders as plain grid HTML (no React needed) on the public
// blog page, and as an editable grid with per-cell upload/replace/remove
// while inside the Tiptap editor.

export type ImageGridOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGrid: {
      insertImageGrid: (columns: number) => ReturnType;
    };
  }
}

function parseImages(el: HTMLElement): (string | null)[] {
  const cells = Array.from(el.querySelectorAll(":scope > .img-grid-cell"));
  return cells.map((cell) => cell.querySelector("img")?.getAttribute("src") || null);
}

export const ImageGrid = Node.create<ImageGridOptions>({
  name: "imageGrid",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      columns: {
        default: 2,
        parseHTML: (el) => parseInt(el.getAttribute("data-columns") || "2", 10),
        renderHTML: (attrs) => ({ "data-columns": attrs.columns }),
      },
      images: {
        default: [null, null] as (string | null)[],
        parseHTML: (el) => parseImages(el as HTMLElement),
        // The cells themselves are rendered explicitly in renderHTML below,
        // so this attribute doesn't need its own HTML representation.
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-grid"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const columns: number = node.attrs.columns;
    const images: (string | null)[] = node.attrs.images || [];
    const cells = images.map((src) =>
      src
        ? ["div", { class: "img-grid-cell" }, ["img", { src }]]
        : ["div", { class: "img-grid-cell img-grid-cell-empty" }]
    );
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "image-grid",
        "data-columns": columns,
        class: `img-grid img-grid-${columns}`,
      }),
      ...cells,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;
  },

  addCommands() {
    return {
      insertImageGrid:
        (columns: number) =>
        ({ commands }) => {
          const safeColumns = Math.min(4, Math.max(2, columns));
          return commands.insertContent({
            type: this.name,
            attrs: { columns: safeColumns, images: Array.from({ length: safeColumns }, () => null) },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageGridNodeView);
  },
});

function ImageGridNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const columns: number = node.attrs.columns;
  const images: (string | null)[] = node.attrs.images || [];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);

  async function uploadToCell(file: File, index: number) {
    setUploadingIndex(index);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        message.error(data.error || "Upload failed.");
        return;
      }
      const next = [...images];
      next[index] = data.url;
      updateAttributes({ images: next });
    } catch {
      message.error("Upload failed. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  }

  function removeImage(index: number) {
    const next = [...images];
    next[index] = null;
    updateAttributes({ images: next });
  }

  function addColumn() {
    if (columns >= 4) return;
    updateAttributes({ columns: columns + 1, images: [...images, null] });
  }

  function removeColumn() {
    if (columns <= 2) return;
    updateAttributes({ columns: columns - 1, images: images.slice(0, columns - 1) });
  }

  return (
    <NodeViewWrapper className={`img-grid-editor-wrap${selected ? " is-selected" : ""}`} contentEditable={false}>
      <div className="img-grid-editor-toolbar">
        <span>{columns}-column image row</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button type="button" onClick={removeColumn} disabled={columns <= 2} title="Remove a column">
            −
          </button>
          <button type="button" onClick={addColumn} disabled={columns >= 4} title="Add a column">
            +
          </button>
          <button type="button" onClick={deleteNode} title="Delete this row">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className={`img-grid img-grid-${columns}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div className="img-grid-cell" key={i}>
            {images[i] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[i] as string} alt="" />
                <div className="img-grid-cell-actions">
                  <button type="button" onClick={() => fileInputs.current[i]?.click()} title="Replace image">
                    <RefreshCw size={12} />
                  </button>
                  <button type="button" onClick={() => removeImage(i)} title="Remove image">
                    <X size={12} />
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="img-grid-cell-empty-btn"
                onClick={() => fileInputs.current[i]?.click()}
                disabled={uploadingIndex === i}
              >
                <ImagePlus size={18} />
                <span>{uploadingIndex === i ? "Uploading..." : "Add image"}</span>
              </button>
            )}
            <input
              ref={(el) => {
                fileInputs.current[i] = el;
              }}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadToCell(file, i);
                e.target.value = "";
              }}
            />
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
}
