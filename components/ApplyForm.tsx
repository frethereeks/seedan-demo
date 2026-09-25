"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Select, Button, message } from "antd";

const CATEGORIES = ["Agribusiness", "Manufacturing", "Logistics", "Handicrafts", "Technology", "Services", "Other"];
const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function ApplyForm() {
  const [form, setForm] = useState({
    fullName: "",
    organizationName: "",
    email: "",
    phone: "",
    category: "",
    stateOfOperation: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.organizationName || !form.email || !form.phone || !form.category || !form.stateOfOperation) {
      setError("Please fill in every field.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      setDone(true);
      message.success("Application submitted!");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="sidebar-card">
        <h4 style={{ color: "var(--accent)" }}>Application received</h4>
        <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>
          Thank you, {form.fullName}. Your application for <strong>{form.organizationName}</strong> has
          been submitted and is now <strong>pending review</strong>. Our admin team will approve,
          reject, or reach out for more information — this exact decision is made from the dashboard
          you'll see in the walkthrough video.
        </p>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "underline", fontSize: 14 }}>
          ← Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>
          Full name
        </label>
        <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} size="large" />
      </div>
      <div>
        <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>
          Business / Organization name
        </label>
        <Input value={form.organizationName} onChange={(e) => update("organizationName", e.target.value)} size="large" />
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>
            Email
          </label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} size="large" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>
            Phone
          </label>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} size="large" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>
            Sector / Category
          </label>
          <Select
            style={{ width: "100%" }}
            size="large"
            value={form.category || undefined}
            placeholder="Select a category"
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            onChange={(v) => update("category", v)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>
            State of operation
          </label>
          <Select
            style={{ width: "100%" }}
            size="large"
            value={form.stateOfOperation || undefined}
            placeholder="Select a state"
            showSearch
            options={STATES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => update("stateOfOperation", v)}
          />
        </div>
      </div>

      {error && <p style={{ color: "#c0392b", fontSize: 13.5 }}>{error}</p>}

      <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ marginTop: 8 }}>
        Submit application
      </Button>
    </form>
  );
}
