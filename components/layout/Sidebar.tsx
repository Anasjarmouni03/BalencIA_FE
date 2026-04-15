"use client";

// components/layout/Sidebar.tsx — Navigation sidebar

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { EMPLOYEE_NAV, MANAGER_NAV } from "@/lib/constants";
import { getProfileImageUrl } from "@/lib/profile-images";
import Avatar from "@/components/ui/Avatar";

import Image from "next/image";

// ─── Nav icons ─────────────────────────────────────────────────────────────
// Simple inline SVG icons — no icon library dependency

function CheckinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function navIconForHref(href: string): React.ReactNode {
  if (href.startsWith("/manager?tab=reports")) return <ReportIcon />;
  if (href.startsWith("/manager?tab=settings")) return <SettingsIcon />;
  if (href.startsWith("/manager")) return <TeamIcon />;
  if (href === "/checkin") return <CheckinIcon />;
  if (href === "/dashboard") return <DashboardIcon />;
  return null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { role, session } = useAuth();
  const [activeOverride, setActiveOverride] = useState<string | null>(null);

  const navItems = role === "manager" ? MANAGER_NAV : EMPLOYEE_NAV;
  const activeManagerTab =
    activeOverride ??
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("tab") ?? "overview"
      : "overview");

  function isActiveHref(href: string): boolean {
    if (!href.startsWith("/manager")) {
      return pathname === href || pathname.startsWith(href + "/");
    }

    if (!(pathname === "/manager" || pathname.startsWith("/manager/"))) return false;

    const queryPart = href.includes("?") ? href.split("?")[1] : "";
    const targetTab = new URLSearchParams(queryPart).get("tab");

    if (!targetTab) return activeManagerTab === "overview";
    return activeManagerTab === targetTab;
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-sidebar bg-background-primary border-r border-border flex flex-col z-30">
      {/* ─── Brand ─────────────────────────────────────────────────── */}
      <div className="h-topbar flex items-center px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5 flex-1 pt-1.5">
          <div className="relative w-32 h-10 shrink-0">
            <Image src="/logo-text.png" alt="BalancIA Logo" fill sizes="128px" className="object-contain object-left" priority />
          </div>
        </div>
      </div>

      {/* ─── Navigation ────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = isActiveHref(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (!item.href.startsWith("/manager")) {
                  setActiveOverride(null);
                  return;
                }
                const queryPart = item.href.includes("?") ? item.href.split("?")[1] : "";
                const targetTab = new URLSearchParams(queryPart).get("tab") ?? "overview";
                setActiveOverride(targetTab);
              }}
              className={[
                "flex relative items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium transition-all duration-150",
                isActive
                  ? "bg-brand-subtle text-text-primary [&>svg]:text-[#2f8876]"
                  : "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {/* Active gradient indicator bar */}
              {isActive && (
                <span className="absolute left-0 w-0.5 h-6 bg-brand rounded-r-full" />
              )}
              <span className={isActive ? "text-[#2f8876]" : ""}>
                {navIconForHref(item.href)}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ─── User Section ──────────────────────────────────────────── */}
      {session && (
        <div className="border-t border-border px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar
              name={session.user.name}
              imageUrl={getProfileImageUrl(session.user)}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-body font-medium text-text-primary truncate leading-tight">
                {session.user.name}
              </span>
              <span className="text-caption text-text-secondary capitalize leading-tight">
                {session.user.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
