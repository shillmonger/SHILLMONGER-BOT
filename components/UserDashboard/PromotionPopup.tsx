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
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[400px] bg-neutral-950 rounded-none overflow-hidden border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Slider Section */}
        <div className="relative h-[180px] overflow-hidden border-b-2 border-black">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentIndex}
              src={IMAGES[currentIndex]}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Trading Promotion"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 z-[1]" />
  
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-3 right-3 w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-50 hover:bg-neutral-800 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
  
          <div className="absolute top-3 left-3 flex gap-2 z-20">
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-700 text-[9px] font-black text-neutral-50 uppercase tracking-widest">
              Rewards
            </span>
            <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure
            </span>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {IMAGES.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 cursor-pointer transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>Market Predictions Live</span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight tracking-tight uppercase">
              Predict Gold Price
            </h2>
            <p className="text-neutral-400 text-xs leading-relaxed font-medium">
              Test your market analysis skills. Predict if gold prices will go up or down. Win predictions to earn $5 daily.
            </p>
          </div>

          {/* Stats/Info Row */}
          <div className="flex items-center justify-between py-3 border-y border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-900 border border-neutral-800">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">Rewards</p>
                <p className="text-sm font-black text-white">$5 Per Win</p>
              </div>
            </div>
            <div className="text-right font-mono text-xs font-black text-emerald-400 uppercase tracking-widest">
              Daily Challenge
            </div>
          </div>

          {/* Action Button */}
          <Link href="#" onClick={onClose}>
            <button className="group relative w-full cursor-pointer bg-neutral-900 text-neutral-50 font-black text-xs uppercase tracking-widest py-3 px-6 border-2 border-neutral-700 hover:bg-neutral-800 transition-colors overflow-hidden">
              <span className="absolute inset-0 bg-neutral-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-neutral-950 transition-colors duration-300">
                Predict Gold Now
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}