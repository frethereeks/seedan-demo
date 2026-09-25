"use client";

import { Tooltip } from "antd";
import {
  LayoutDashboardIcon,
  NewspaperIcon,
  UsersIcon,
  ShieldCheckIcon,
  LogOutIcon,
  PanelRightIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { can, type Role } from "@/lib/roles";

const sideBarStyle: React.CSSProperties = {
  overflowY: "auto",
  position: "fixed",
  height: "100vh",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  left: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

export default function Sidebar({
  role,
  navOpen,
  setNavOpen,
  navCollapsed,
  setNavCollapsed,
  onLogout,
}: {
  role: Role;
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navCollapsed: boolean;
  setNavCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  const navLinks = [
    { id: "overview", label: "Overview", icon: <LayoutDashboardIcon size={18} />, path: "/dashboard" },
    { id: "posts", label: "Blog Posts", icon: <NewspaperIcon size={18} />, path: "/dashboard/posts" },
    ...(can(role, "members_view")
      ? [{ id: "members", label: "Membership", icon: <UsersIcon size={18} />, path: "/dashboard/members" }]
      : []),
    ...(can(role, "users_manage")
      ? [{ id: "users", label: "Users & Roles", icon: <ShieldCheckIcon size={18} />, path: "/dashboard/users" }]
      : []),
  ];

  const isActive = (path: string) => (path === "/dashboard" ? pathname === path : pathname.startsWith(path));

  return (
    <>
      <nav
        style={sideBarStyle}
        className={`group py-2 space-y-4 hidden md:flex flex-col justify-between bg-primary rounded-r-2xl duration-300! transition-all! divide-y! divide-white/20! ${
          navCollapsed ? "w-12" : "w-48"
        }`}
      >
        <div className="flex items-center justify-between md:gap-4 w-full h-13 relative px-0.5">
          <Link
            href="/dashboard"
            className={`${navCollapsed ? "group-hover:hidden" : "block"} h-12 relative shrink-0 flex items-center p-2 gap-2`}
          >
            <Image src="/icon.png" alt="SEEDAN Portal" width={22} height={22} priority className="rounded" />
            {!navCollapsed && (
              <span className="text-white text-sm font-bold tracking-tight whitespace-nowrap">SEEDAN Portal</span>
            )}
          </Link>
          <div
            onClick={() => setNavCollapsed(!navCollapsed)}
            className={`${
              navCollapsed ? "opacity-0 group-hover:opacity-100 pl-2" : "opacity-100 pr-2"
            } duration-300! transition-all! h-8 w-8 text-xs text-white cursor-e-resize grid place-items-center`}
          >
            <PanelRightIcon size={18} />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            {navLinks.map((nav) => (
              <Tooltip key={nav.id} title={nav.label} trigger={["hover"]} placement="right">
                <Link
                  href={nav.path}
                  className={`${
                    navCollapsed ? "w-12" : "w-48"
                  } overflow-x-hidden no-underline! flex items-center gap-4 px-3 py-2 text-white! text-sm md:text-base border-l-4! ${
                    isActive(nav.path) ? "bg-white/30! border-secondary!" : "border-transparent!"
                  } hover:bg-white/30 hover:border-secondary!`}
                >
                  <span className="shrink-0 -translate-x-0.5">{nav.icon}</span>
                  <p className={`${navCollapsed ? "hidden" : "visible"} text-sm -tracking-tight whitespace-nowrap`}>
                    {nav.label}
                  </p>
                </Link>
              </Tooltip>
            ))}
          </div>
          <div className="relative pt-4">
            <span
              onClick={onLogout}
              className={`${
                navCollapsed ? "w-12" : "w-48"
              } overflow-x-hidden no-underline! flex items-center gap-4 px-3 py-1! text-white! text-sm md:text-base bg-transparent! border-l-4! border-secondary! text-left cursor-pointer`}
            >
              <span className="shrink-0 -translate-x-0.5">
                <LogOutIcon size={18} />
              </span>
              <p className={`${navCollapsed ? "hidden" : "visible"} text-sm -tracking-tight whitespace-nowrap`}>
                Logout
              </p>
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav
        className={`${
          navOpen ? "flex md:hidden" : "hidden md:hidden"
        } flex-col bg-primary p-4 z-50 fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-y-auto`}
      >
        <div className="flex justify-between items-center gap-4 pb-4 mb-2 border-b! border-white/20!">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="SEEDAN Portal" width={28} height={28} priority className="rounded" />
            <span className="text-white text-base font-bold tracking-tight">SEEDAN Portal</span>
          </div>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="grid place-items-center p-1 bg-transparent! border-none! rounded-lg text-white text-xs h-8 w-8 sm:h-10 sm:w-10 shrink-0 cursor-pointer"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            {navLinks.map((nav) => (
              <Link
                key={nav.id}
                href={nav.path}
                className={`overflow-x-hidden no-underline! flex items-center gap-3 -translate-x-3 px-3 py-2.5 text-white! text-sm md:text-base ${
                  isActive(nav.path) ? "bg-white/30! border-secondary!" : "border-transparent!"
                } hover:bg-white/30 border-l-4! hover:border-secondary!`}
              >
                <span className="shrink-0 scale-75">{nav.icon}</span>
                <p className="text-white text-xs sm:text-sm -tracking-tight whitespace-nowrap">{nav.label}</p>
              </Link>
            ))}
          </div>
          <div className="relative pt-4">
            <span
              onClick={onLogout}
              className="overflow-x-hidden no-underline! flex items-center gap-3 -translate-x-3 px-3 py-1! text-white! text-xs sm:text-sm bg-transparent border-l-4! border-secondary! text-left cursor-pointer"
            >
              <span className="shrink-0 scale-75">
                <LogOutIcon size={18} />
              </span>
              <p className="text-xs sm:text-sm -tracking-tight whitespace-nowrap">Logout</p>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
