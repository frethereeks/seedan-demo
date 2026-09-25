"use client";

// Tiny client-side helper to read the current user's role/name from a
// lightweight endpoint, for components that need it outside a server
// component (e.g. to hide the Approve/Reject buttons for "staff").
import { useEffect, useState } from "react";

type SessionInfo = { role: string; name: string; email: string } | null;

export function useSession() {
  const [session, setSession] = useState<SessionInfo>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setSession(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return { role: session?.role ?? null, name: session?.name ?? null, email: session?.email ?? null, loaded };
}
