"use client";

import { Menu } from "lucide-react";

interface UserMobileHeaderProps {
  onLeftClick: () => void;
  onRightClick: () => void;
}

export default function UserMobileHeader({
  onLeftClick,
  onRightClick,
}: UserMobileHeaderProps) {
  return (
    <header
      className="
        lg:hidden
        sticky top-0 z-40
        flex items-center justify-between
        bg-neutral-950 text-white
        border-b-2 border-black
        px-4 py-3
      "
    >
      <button
        onClick={onLeftClick}
        aria-label="Open menu"
        className="p-2 -ml-2 hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <span className="text-sm font-black uppercase tracking-[0.2em]">
        Shillmonger
      </span>

      <button
        onClick={onRightClick}
        aria-label="Open panel"
        className="p-2 -mr-2 hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}