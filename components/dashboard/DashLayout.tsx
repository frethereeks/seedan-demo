"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import type { Role } from "@/lib/roles";

export default function DashLayout({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [navCollapsed, setNavCollapsed] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // const handleSearch = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Placeholder — no search index exists in this demo yet.
  // };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex relative gap-2 md:gap-1">
      <Sidebar
        role={role}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        navCollapsed={navCollapsed}
        setNavCollapsed={setNavCollapsed}
        onLogout={handleLogout}
      />
      <div className={`flex-1 flex flex-col bg-background min-h-screen ${navCollapsed ? "md:ml-12" : "md:ml-48"}`}>
        <section className="bg-primary md:bg-background p-2.5 sm:p-4 rounded-b-xl">
          <nav className="bg-white shadow-xl rounded-xl pl-4 p-3 flex justify-between items-center gap-1.5">
            <h2 className="text-sm sm:text-sm md:text-base lg:text-lg text-dark font-bold">Welcome back, {name}</h2>
            <div className="ml-auto flex gap-2 justify-end pl-4 items-center">
              {/* <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center bg-background p-1 md:py-0.5 rounded-lg flex-1 w-full min-w-xs sm:min-w-sm"
              >
                <button type="submit" className="p-1 text-dark text-xs cursor-pointer">
                  <SearchIcon size={14} />
                </button>
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  name="search"
                  placeholder="Search posts, members..."
                  className="p-0.5 text-sm text-text flex-1 bg-transparent outline-none"
                />
              </form> */}
              <div
                title={name}
                className="grid place-items-center bg-dark rounded-3xl overflow-hidden text-white text-xs font-bold h-6 w-6 sm:h-8 sm:w-8 shrink-0"
              >
                {initials}
              </div>
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="grid md:hidden place-items-center border border-gray-100 bg-background p-1 rounded-lg text-dark text-xs h-7 w-7 sm:h-8 sm:w-8 shrink-0 cursor-pointer"
              >
                <MenuIcon size={16} />
              </button>
            </div>
          </nav>
        </section>
        <section className="px-2.5 sm:px-4 pb-6 rounded-b-xl space-y-4 py-4">{children}</section>
      </div>
    </div>
  );
}
