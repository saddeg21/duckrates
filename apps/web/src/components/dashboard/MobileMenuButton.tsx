"use client";

import { useUIStore } from "@/store/ui.store";

export function MobileMenuButton() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 rounded text-muted hover:text-on-surface hover:bg-surface-overlay transition-colors"
      aria-label="Open menu"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="2" y1="4.5" x2="16" y2="4.5" />
        <line x1="2" y1="9" x2="16" y2="9" />
        <line x1="2" y1="13.5" x2="16" y2="13.5" />
      </svg>
    </button>
  );
}
