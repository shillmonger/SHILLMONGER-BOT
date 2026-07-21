"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cookieConsent") as
      | "accepted"
      | "declined"
      | null;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [closed, setClosed] = useState(false);

  const handleClose = () => {
    setClosed(true);
    // Optional: re-show after 5 minute
    setTimeout(() => setClosed(false), 5 * 60 * 1000);
  };

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookieConsent", value);
    setConsent(value);
  };

  return (
    <AnimatePresence>
      {mounted && consent === null && !closed && (
        <>
          {/* 1. THE BLUR OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-neutral-950/60 backdrop-blur-md"
          />

          {/* 2. THE CENTERED CARD */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[400px] bg-neutral-950 border-2 border-neutral-800 rounded-none p-6 md:p-8 overflow-hidden"
            >
              {/* Close Button - Sharp Brutalist Box */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-neutral-50 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all p-1.5 rounded-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* Grayscale Cookie Illustration */}
              <div className="flex justify-center">
                <img
                  src="https://i.postimg.cc/L5wkcDJ6/cookie.png"
                  alt="Cookie"
                  className="w-40 h-40 object-contain grayscale-50 filter contrast-125 brightness-90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <h3 className="text-xl font-black text-neutral-50 mb-3 uppercase tracking-tight">
                  Data & Security
                </h3>
                
                <p className="text-neutral-400 text-xs md:text-sm mb-6 leading-relaxed font-medium">
                  We use essential cookies to secure your session, protect your
                  wallet connections, and optimize your trading dashboard
                  performance. By continuing, you agree to our security
                  protocols.
                </p>

                {/* Actions - Flat high contrast buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleConsent("accepted")}
                    className="w-full py-2.5 rounded-none bg-neutral-50 text-neutral-950 font-black text-xs uppercase tracking-widest border-2 border-neutral-50 hover:bg-neutral-950 hover:text-neutral-50 transition-all duration-300 cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleConsent("declined")}
                    className="w-full py-2.5 rounded-none bg-transparent text-neutral-400 font-black text-xs uppercase tracking-widest border-2 border-neutral-800 hover:border-neutral-50 hover:text-neutral-50 transition-all duration-300 cursor-pointer"
                  >
                    No thanks
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}