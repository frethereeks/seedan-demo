"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link href="/" className="logo" onClick={() => setOpen(false)}>
        SEEDAN <span style={{ color: "var(--accent)" }}>Portal</span>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={open ? "open" : undefined}>
        <Link href="/" onClick={() => setOpen(false)}>
          Home
        </Link>
        <Link href="/blog" onClick={() => setOpen(false)}>
          Blog
        </Link>
        <Link href="/apply" onClick={() => setOpen(false)}>
          Become a Member
        </Link>
        <Link href="/login" onClick={() => setOpen(false)}>
          Log in
        </Link>
      </nav>
    </header>
  );
}
