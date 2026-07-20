"use client";

import { Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface UserMobileHeaderProps {
  onLeftClick: () => void;
  onRightClick: () => void;
}

export default function UserMobileHeader({
  onLeftClick,
  onRightClick,
}: UserMobileHeaderProps) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Ignore tiny jitters (e.g. rubber-band scroll on iOS)
      if (Math.abs(delta) < 5) return;

      if (currentScrollY < 40) {
        // Always show header near the top of the page
        setHidden(false);
      } else if (delta > 0) {
        // Scrolling down -> hide
        setHidden(true);
      } else {
        // Scrolling up -> show
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        lg:hidden
        sticky top-0 z-40
        flex items-center justify-between
        bg-neutral-950 text-white
        border-b-2 border-black
        px-4 py-3
        transition-transform duration-300 ease-in-out
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <button
        onClick={onLeftClick}
        aria-label="Open menu"
        className="rounded-none text-neutral-50 p-1 border border-neutral-800 bg-neutral-900"
      >
        <Menu className="w-5 h-5" />
      </button>
      <span className="text-sm font-black uppercase tracking-[0.2em]">
        XAUUSD BOT
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