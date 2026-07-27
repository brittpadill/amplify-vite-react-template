import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ThemeToggle } from "./theme-toggle";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  FolderOpen,
  Settings,
  Wrench,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Estimates",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "New Estimate",
    href: "/estimates/new",
    icon: PlusCircle,
  },
  {
    label: "Estimate History",
    href: "/estimates/history",
    icon: ClipboardList,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function NavItem({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  collapsed: boolean;
  onClick?: () => void;
}) {
  const [location] = useLocation();

  // Active: exact match for "/" or starts-with for deeper paths
  const isActive =
    item.href === "/"
      ? location === "/"
      : location.startsWith(item.href);

  return (
    <Link href={item.href} onClick={onClick}>
      <span
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        )}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
        {!collapsed && isActive && (
          <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
        )}
      </span>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuthenticator();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userEmail = user?.signInDetails?.loginId ?? "User";
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300",
          "bg-sidebar border-r border-sidebar-border",
          // Desktop: collapsible
          collapsed ? "w-[68px]" : "w-[240px]",
          // Mobile: hidden by default, slides in
          "max-lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "max-lg:-translate-x-full"
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <p className="text-sm font-bold text-sidebar-foreground truncate">
                AI Plumbing
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Estimator
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 mt-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* User + actions */}
        <div className="p-2 border-t border-sidebar-border space-y-1 shrink-0">
          {/* Theme toggle */}
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70",
              collapsed && "justify-center px-0"
            )}
          >
            <ThemeToggle />
            {!collapsed && (
              <span className="text-sm">Toggle theme</span>
            )}
          </div>

          {/* User info + sign out */}
          <button
            onClick={signOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? `Sign out (${userEmail})` : undefined}
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-primary">
                {initials}
              </span>
            </div>
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">{userEmail}</span>
                <LogOut className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "hidden lg:flex absolute -right-3 top-20",
            "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
            "items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            className={cn("w-3 h-3 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </aside>

      {/* ── Main content area ──────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-[100dvh] transition-all duration-300",
          collapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-background/95 backdrop-blur border-b border-border shrink-0">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Page title area — left intentionally empty; pages render their own headings */}
          <div className="hidden lg:block" />

          {/* Right side placeholder */}
          <div className="flex items-center gap-2" />
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
