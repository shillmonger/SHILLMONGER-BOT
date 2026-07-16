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
      {/* Floating Telegram Button (Sharp Corners, Monochrome) */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-2 z-50 sm:bottom-10 sm:right-6 flex items-center justify-center w-12 h-12 rounded-none
          bg-neutral-950 text-white border border-neutral-800 shadow-lg transition-all duration-300 
          hover:bg-white hover:text-neutral-950 hover:border-white cursor-pointer focus:outline-none"
        aria-label="Join Telegram"
        title="Join Telegram"
      >
        <Send className="w-5 h-5" />
      </a>

      {children}

      {/* Floating Scroll to Top Button (Sharp Corners, Monochrome) */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="
            fixed bottom-25 right-2 sm:right-6 z-[50]          
            bg-neutral-950 text-white border border-neutral-800
            w-12 h-12 rounded-none
            flex items-center justify-center
            shadow-2xl
            hover:bg-white hover:text-neutral-950 hover:border-white
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