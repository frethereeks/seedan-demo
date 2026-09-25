import { Tag } from "antd";

const COLORS: Record<string, string> = {
  // Post statuses
  draft: "#f3f4f6",
  published: "#dcfce7",
  // Member statuses
  pending: "gold",
  approved: "#dcfce7",
  rejected: "#f7e9ec",
  suspended: "volcano",
};

const LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

export default function StatusTag({ status }: { status: string }) {
  return <Tag color={COLORS[status] ?? "default"} className="text-slate-700!">{LABELS[status] ?? status}</Tag>;
}
