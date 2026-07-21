"use client";

import { Menu } from "lucide-react";

interface AdminMobileHeaderProps {
  onLeftClick: () => void;
  onRightClick: () => void;
}

export default function AdminHeader({
  onLeftClick,
  onRightClick,
}: AdminMobileHeaderProps) {
  return (
    <header
      className="
        lg:hidden
        fixed top-0 left-0 right-0 z-40
        flex items-center justify-between
        bg-neutral-950 text-white
        border-b-2 border-black
        px-4 py-3
      "
    >
      <button
        onClick={onLeftClick}
        aria-label="Open menu"
        className="rounded-none text-neutral-50 p-1 border border-neutral-800 bg-neutral-900"
      >
        <Menu className="w-5 h-5" />
      </button>

      <span className="text-lg font-black uppercase tracking-[0.2em]">
        ADMIN PANEL
      </span>

      <button
        onClick={onRightClick}
        aria-label="Open panel"
        className="rounded-none text-neutral-50 p-1 border border-neutral-800 bg-neutral-900"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}