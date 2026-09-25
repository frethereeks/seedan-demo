"use client";

import React from "react";
import { Modal } from "antd";
import { TriangleAlert, CircleCheck } from "lucide-react";

// A shared confirmation dialog for every state-changing action in the
// dashboard (approve/reject/suspend a member, change or remove a user's
// role, delete a post, ...). Built on antd's imperative Modal.confirm, with
// a custom Tailwind-styled body so it matches the rest of the dashboard
// shell rather than antd's default confirm look.

export type ConfirmTone = "danger" | "warning" | "success";

interface ConfirmModalProps {
  title?: string;
  content: string;
  icon?: React.ReactNode;
  tone?: ConfirmTone;
  okText?: string;
  cancelText?: string;
  okBtnBgColor?: string; // e.g. 'bg-red-600' or 'bg-secondary!' — overrides `tone`'s default
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

const TONE_STYLES: Record<ConfirmTone, { circle: string; iconColor: string; okBg: string }> = {
  danger: { circle: "bg-red-100", iconColor: "#dc2626", okBg: "bg-red-600!" },
  warning: { circle: "bg-amber-100", iconColor: "#d97706", okBg: "bg-amber-500!" },
  success: { circle: "bg-green-100", iconColor: "#16a34a", okBg: "bg-secondary!" },
};

function defaultIcon(tone: ConfirmTone) {
  const { circle, iconColor } = TONE_STYLES[tone];
  const IconCmp = tone === "success" ? CircleCheck : TriangleAlert;
  return (
    <div className={`h-full w-full rounded-full grid place-items-center ${circle}`}>
      <IconCmp size={34} color={iconColor} />
    </div>
  );
}

export const appConfirmModal = ({
  title = "Proceed with this action?",
  content,
  icon,
  tone = "warning",
  okText = "Confirm",
  cancelText = "Cancel",
  okBtnBgColor,
  onOk,
  onCancel,
}: ConfirmModalProps) => {
  Modal.confirm({
    icon: null, // Disable antd's default icon so we can render our own, centered
    content: (
      <div className="flex flex-col items-center text-center pt-0">
        <div className="mb-2 relative h-16 w-16 overflow-hidden shrink-0">{icon ?? defaultIcon(tone)}</div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{content}</p>
        <div className="flex justify-between gap-3 w-full my-1.5">
          <button
            type="button"
            onClick={() => {
              Modal.destroyAll();
              if (onOk) onOk();
            }}
            className={`flex-1 cursor-pointer w-full py-2.5 px-4 text-white font-semibold rounded-lg border-none! capitalize! transition-colors ${
              okBtnBgColor ?? TONE_STYLES[tone].okBg
            } hover:opacity-90`}
          >
            {okText}
          </button>

          <button
            type="button"
            onClick={() => {
              Modal.destroyAll();
              if (onCancel) onCancel();
            }}
            className="flex-1 cursor-pointer w-full py-2.5 px-4 bg-transparent border! border-text/50! text-text font-semibold rounded-lg transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    ),
    footer: null, // Suppress antd's default OK/Cancel footer — we render our own buttons above
    maskClosable: true,
    centered: true,
    width: 400,
    rootClassName: "custom-tailwind-modal",
  });
};
