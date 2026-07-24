"use client";

import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface UserMobileHeaderProps {
  onLeftClick: () => void;
  onRightClick: () => void;
}

export default function UserMobileHeader({
  onLeftClick,
  onRightClick,
}: UserMobileHeaderProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    "SMG BOT",
    "XAUUSD BOT",
    "FOREX BOT",
    "MT5 TERMINAL",
    "EXNESS",
    "SHILLMONGER"
  ];

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const delayAfterComplete = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayAfterComplete);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex, texts]);

  return (
    <header
      className="
        lg:hidden
        fixed top-0 left-0 right-0 z-40
        flex items-center justify-between
        bg-black
        border-b border-indigo-900/50
        px-4 py-2
      "
    >
      <button
        onClick={onLeftClick}
        aria-label="Open menu"
        className="rounded-lg text-indigo-300 p-1.5 border border-indigo-800 bg-indigo-900"
      >
        <Menu className="w-5 h-5" />
      </button>
      <span className="text-lg font-black uppercase tracking-[0.2em] text-indigo-300">
        {displayText}
      </span>
      <button
        onClick={onRightClick}
        aria-label="Open panel"
        className="rounded-lg text-indigo-300 p-1.5 border border-indigo-800 bg-indigo-900"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}