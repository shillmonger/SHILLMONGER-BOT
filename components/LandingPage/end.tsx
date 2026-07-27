"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProfileCTASection() {
  const [currentImage, setCurrentImage] = useState("/pfp1.png");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev === "/pfp1.png" ? "/pfp.png" : "/pfp1.png"));
        setIsFlipping(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative w-full bg-white py-20">
      <div className="mx-auto max-w-[1400px] px-3 md:px-6">
        {/* Main Card Wrapper — NOTE: no overflow-hidden here anymore */}
        <div className="relative rounded-[2rem] bg-gradient-to-r from-indigo-950 via-indigo-600 to-indigo-950 pt-32 pb-16 px-6 md:px-12 text-center text-white shadow-2xl">

          {/* Clipped inner layer — only the glow blobs live here */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[120px]" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-[#ccff00]/10 blur-[100px]" />
          </div>

          {/* Top Inverted Cutout SVG Overlay — sits above card, unclipped */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-80 md:w-[480px] h-20 sm:h-24 md:h-36 z-10 pointer-events-none">
            <svg
              viewBox="0 0 320 120"
              fill="currentColor"
              className="w-full h-full text-white"
              preserveAspectRatio="none"
            >
              <path d="M 0 -1 L 320 -1 L 320 0 C 250 0 240 105 160 105 C 80 105 70 0 0 0 Z" />
            </svg>
          </div>

          {/* Floating Profile Image — now free to poke above the card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute -top-16 sm:-top-20 md:-top-28 left-1/2 -translate-x-1/2 z-20 w-32 sm:w-40 md:w-56 h-32 sm:h-40 md:h-56"
          >
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotateY: isFlipping ? 180 : 0
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 0.3 }
              }}
              className="relative w-full rounded-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={currentImage}
                alt="Profile picture"
                fill
                priority
                className="object-contain rounded-full"
              />
            </motion.div>
          </motion.div>

          {/* Main Content Area */}
          <div className="relative z-20 max-w-3xl mx-auto space-y-6 mt-6 md:mt-12">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-4xl font-extrabold uppercase tracking-tight leading-[1.1]"
            >
              Grow Beyond <br />
              <span className="text-white">Borders With Automation</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xs sm:text-sm md:text-base text-white/70 font-medium max-w-xl mx-auto leading-relaxed"
            >
              Whether you're trading Gold, Forex pairs, or Indices overseas, our automated MT5 system makes execution simple, fast, secure, and stress-free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-2"
            >
              <Link href="/auth-page/register" className="inline-block">
                <button
                  className="group flex items-center justify-center gap-2 rounded-full cursor-pointer shadow-lg px-7 py-3.5 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 bg-[#ccff00] text-black border border-[#ccff00] hover:bg-white/10 hover:text-white hover:border-white/20 hover:backdrop-blur-md"
                >
                  <span>Start 5 days free trial</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}