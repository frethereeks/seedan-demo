import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Home",
  description:
    "A working demo of the platform proposed for SEEDAN: content management, member registration & approval, and role-gated dashboards — no developer required, just a browser.",
};

export default function HomePage() {
  return (
    <>
      <div className="container">
        <SiteHeader />
      </div>
      <div className="blog-hero">
        <div className="container">
          <h1>SEEDAN Member Portal — Demo</h1>
          <p>
            A working slice of the platform proposed to SEEDAN: content management, member
            registration &amp; approval, and role-gated dashboards. Built to show that day-to-day
            administration needs no developer — just a browser.
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 12, justifyContent: "center" }}>
            <Link
              href="/blog"
              style={{
                background: "#5c7318",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14.5,
              }}
            >
              View the blog
            </Link>
            <Link
              href="/login"
              style={{
                border: "1px solid #5c7318",
                color: "#5c7318",
                padding: "10px 20px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14.5,
              }}
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
