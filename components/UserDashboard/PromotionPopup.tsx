"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, TrendingUp, ShieldCheck, X } from "lucide-react";

const IMAGES = [
  "https://i.postimg.cc/gkW8VrZk/Banner-1.jpg",
  "https://i.postimg.cc/jS8fYX3G/Banner-2.jpg",
  "https://i.postimg.cc/7LdTfLkX/Banner-3.jpg",
  "https://i.postimg.cc/15BnDBSY/Banner-4.webp",
  "https://i.postimg.cc/gjdjZXBs/Banner-5.jpg",
  "https://i.postimg.cc/Zqd5sFG6/Banner-6.jpg",
];

export default function PromotionPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
      }, 4000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-[400px] bg-neutral-950 rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Slider Section */}
        <div className="relative h-[200px] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentIndex}
              src={IMAGES[currentIndex]}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Trading Promotion"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/40 z-[1]" />
  
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-3 right-3 w-8 h-8 bg-neutral-900/80 border border-neutral-700/60 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors z-20 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>
  
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-20">
            <span className="px-2.5 py-1 bg-indigo-950/80 border border-indigo-500/40 rounded-full text-[9px] font-black text-indigo-300 uppercase tracking-widest backdrop-blur-sm">
              Rewards
            </span>
            <span className="px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-indigo-400" /> Secure
            </span>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {IMAGES.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-indigo-400" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>Market Predictions Live</span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight tracking-tight uppercase">
              Predict Gold Price
            </h2>
            <p className="text-neutral-400 text-xs leading-relaxed font-normal">
              Test your market analysis skills. Predict if gold prices will go up or down. Win predictions to earn $5 daily.
            </p>
          </div>

          {/* Stats/Info Row */}
          <div className="flex items-center justify-between py-3 border-y border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-950/60 border border-indigo-800/40 rounded-xl">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest">Rewards</p>
                <p className="text-sm font-black text-white">$5 Per Win</p>
              </div>
            </div>
            <div className="text-right font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Daily Challenge
            </div>
          </div>

          {/* Action Button */}
          <Link href="#" onClick={onClose}>
            <button className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2">
              Predict Gold Now
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}