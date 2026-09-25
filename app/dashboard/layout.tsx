import type { Metadata } from "next";
import DashLayout from "@/components/dashboard/DashLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

// The dashboard's own pages are client components (they need hooks for
// tables/forms), and Next only allows a `metadata` export from a server
// component — so the title/robots setting for the whole /dashboard/* tree
// is set once here, at the layout. It's an internal admin area, so it's
// kept out of search results.
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <DashLayout role={session.role} name={session.name}>
      {children}
    </DashLayout>
  );
}
