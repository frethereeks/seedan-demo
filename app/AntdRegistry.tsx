"use client";

import { ConfigProvider } from "antd";

// Brand tokens loosely matched to the SEEDAN proposal's palette
// (deep ink + olive-gold accent) so the demo reads as "on-brand",
// not a generic Ant Design default theme.
const theme = {
  token: {
    colorPrimary: "#5C7318",
    colorLink: "#5C7318",
    borderRadius: 6,
    controlOutline: 'transparent',
    boxShadow: 'none',
    fontFamily:
      "var(--font-inter), 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
  },
  Button: {
      colorPrimary: "#5C7318",
      algorithm: true,
      primaryShadow: "none",
    },
};

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
