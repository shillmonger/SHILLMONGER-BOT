"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Send } from "lucide-react";

interface ThemeAndScrollProps {
  children?: React.ReactNode;
}

export default function ThemeAndScroll({ children }: ThemeAndScrollProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      setShowScrollTop(scrollTop > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating Telegram Button (Sleek Rounded Gradient Action) */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-2 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full
          bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 
          hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none ring-1 ring-white/20"
        aria-label="Join Telegram"
        title="Join Telegram"
      >
        <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
      </a>

      {children}

      {/* Floating Scroll to Top Button (Sleek Minimalist Dark/White Toggle) */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="
            fixed bottom-22 right-2 sm:bottom-24 sm:right-8 z-[50]          
            bg-white/90 backdrop-blur-md text-neutral-800 border border-neutral-200/80
            w-12 h-12 rounded-full
            flex items-center justify-center
            shadow-lg shadow-neutral-900/5
            hover:bg-neutral-900 hover:text-white hover:border-neutral-900 hover:scale-110
            active:scale-95
            transition-all duration-300 cursor-pointer
          "
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}