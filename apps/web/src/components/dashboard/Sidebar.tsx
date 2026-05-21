"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { logoutAction } from "@lib/actions/auth.actions";
import { EuphratLogo } from "@components/EuphratLogo";

export function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar } = useUIStore();

  const navItems = [
    { label: "All Posts", href: "/dashboard", icon: "⊞" },
    { label: "New Post", href: "/dashboard/posts/new", icon: "✦" },
    { label: "My Profile", href: `/dashboard/users/${userId}`, icon: "⚙" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-on-surface/30 lg:hidden animate-in fade-in duration-150"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-30 h-screen w-60 flex flex-col",
          "bg-surface-low border-r border-border",
          "transition-transform duration-200 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0 lg:z-auto",
        ].join(" ")}
      >
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="hover:no-underline inline-block">
            <EuphratLogo size={28} />
          </Link>
          <p className="font-sans text-xs text-muted mt-1.5 tracking-widest uppercase pl-0.5">
            Dashboard
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded text-sm font-sans transition-colors",
                  isActive
                    ? "bg-surface-overlay text-on-surface font-medium"
                    : "text-muted hover:bg-surface-overlay hover:text-on-surface",
                ].join(" ")}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-sans text-muted hover:text-on-surface hover:bg-surface-overlay transition-colors text-left"
            >
              <span className="text-base leading-none">→</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
