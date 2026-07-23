"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
    // Re-show after 5 minutes
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
          {/* 1. BLUR OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
          />

          {/* 2. CENTERED CARD */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[420px] bg-black border border-neutral-800 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl shadow-blue-950/50"
            >
              {/* Top Blue Ambient Glow */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-600/20 via-blue-950/10 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 cursor-pointer text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all p-2 rounded-full border border-transparent hover:border-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cookie Illustration */}
              <div className="relative z-10 flex justify-center mb-2">
                <img
                  src="https://i.postimg.cc/L5wkcDJ6/cookie.png"
                  alt="Cookie"
                  className="w-36 h-36 object-contain filter drop-shadow-[0_10px_20px_rgba(37,99,235,0.25)]"
                />
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                  Data & Security
                </h3>

                <p className="text-neutral-400 text-xs md:text-sm mb-6 leading-relaxed font-normal">
                  We use essential cookies to secure your session, protect your
                  wallet connections, and optimize your trading dashboard
                  performance. By continuing, you agree to our security
                  protocols.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleConsent("accepted")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all duration-300 cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleConsent("declined")}
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs tracking-wide border border-neutral-800 transition-all duration-300 cursor-pointer"
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