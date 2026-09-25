import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import ApplyForm from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Become a Member",
  description:
    "Apply for SEEDAN membership online — no paperwork, no waiting in line. Track your application status once your account is set up.",
};

export default function ApplyPage() {
  return (
    <>
      <div className="container">
        <SiteHeader />
      </div>
      <div className="container" style={{ maxWidth: 640, padding: "48px 24px 80px" }}>
        <h1 style={{ marginBottom: 6 }}>Become a SEEDAN Member</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
          Fill in the form below to apply. Your application is reviewed by our team — no paperwork,
          no waiting in line. Track your status once your account is set up.
        </p>
        <ApplyForm />
      </div>
    </>
  );
}
