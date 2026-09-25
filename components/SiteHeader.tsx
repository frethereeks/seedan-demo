import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="logo">
        SEEDAN <span style={{ color: "var(--accent)" }}>Portal</span>
      </Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/apply">Become a Member</Link>
        <Link href="/login">Log in</Link>
      </nav>
    </header>
  );
}
