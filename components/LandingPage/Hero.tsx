"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Check, MoreVertical } from "lucide-react";

export default function HeroSection() {
  const navPills = [
    { label: "Automated", active: true },
    { label: "EXNESS", active: false },
    { label: "MT5", active: false },
  ];

  const bullets = [
    "Connect your MetaTrader 5 account to our automated trading system.",
    "Our bot executes trades when valid market conditions are detected.",
  ];

  return (
    <section className="relative w-full bg-white pt-20 lg:pt-20 py-20 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-3">
        {/* Top Nav Pills (Outside the purple card) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3 flex items-center gap-3 overflow-x-auto"
        >
          {navPills.map((pill) => (
            <button
              key={pill.label}
              className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                pill.active
                  ? "bg-[#ccff00] text-black shadow-sm"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </motion.div>

        {/* Main Hero Card Container */}
        <div className="relative rounded-[2rem] bg-gradient-to-r from-[#2932e1] via-[#4842ee] to-[#6366f1] p-6 md:p-12 lg:p-10 lg:min-h-[550px] flex items-center">
          
          {/* Subtle background glow effects inside the card */}
          <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-blue-400/20 blur-[100px]" />

          {/* Grid Layout */}
          <div className="grid w-full lg:w-4xl grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 z-10 max-w-xl">
              {/* Bullet Points */}
              <ul className="mb-8 lg:mb-10 space-y-3">
                {bullets.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-xs md:text-sm text-white/80 font-medium">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#ccff00]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-[1.08] mb-8 lg:mb-10">
                The Smarter Way
                to Trade Forex
              </h1>

              {/* CTA Buttons */}
<div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4 lg:gap-6">
  <Link href="/auth-page/register" className="w-full sm:w-auto">
    <button className="w-full sm:w-auto rounded-2xl cursor-pointer bg-[#0d0d0d] px-7 py-4 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105 active:scale-95">
      Start 5 days free trial
    </button>
  </Link>

  <Link
    href="/auth-page/login"
    className="w-full sm:w-auto text-center rounded-2xl cursor-pointer bg-white px-7 py-4 text-sm font-semibold text-black shadow-xl transition-transform hover:scale-105 active:scale-95"
  >
    Sign in Account 
  </Link>
</div>
            </div>

            {/* Right Column: Phone image on mobile, reserved breakout space on desktop */}
            <div className="lg:col-span-5 relative">
              {/* Mobile / tablet inline image (hidden on lg where the breakout version takes over) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto h-[600px] w-full overflow-hidden lg:hidden"
              >
                <Image
                  src="/phone-half.png"
                  alt="Phone Screen App Interface"
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>

              {/* Mobile stat pills under the image */}
              <div className="mt-5 flex flex-wrap justify-center gap-3 lg:hidden">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-neutral-800 shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#ccff00]" />
                  +45 pips • $320
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#ccff00] px-4 py-2 text-[11px] font-semibold text-black shadow-lg">
                  Profit +$1,245.00
                </div>
              </div>

              {/* Desktop-only reserved space for the absolute breakout phone frame */}
              <div className="hidden lg:block h-[400px]" />
            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* OVERLAY ELEMENTS (Phone mockup breaking out of container) — desktop only, unchanged */}
          {/* ------------------------------------------------------------- */}

          {/* 1. Trading Activity Floating Box (Left of Phone) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden xl:block absolute left-[46%] z-40 top-1/2 -translate-y-1/2 z-30 w-[240px] rounded-2xl bg-white p-4 shadow-2xl text-neutral-800 text-xs"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 mb-3 font-semibold">
              <span className="rounded-full bg-[#ccff00] px-3 py-1 text-[10px] text-black">
                Trading Activity
              </span>
              <span className="text-[10px] text-neutral-400">Today</span>
            </div>

            <div className="space-y-2.5 text-[11px]">
              <div>
                <div className="flex items-center justify-between font-semibold">
                  <span>XAUUSD Buy Order</span>
                  <span className="rounded-full bg-[#ccff00] px-2 py-0.5 text-[9px]">Profit</span>
                </div>
                <p className="text-[10px] text-neutral-400">+45 pips • $320</p>
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold">
                  <span>XAUUSD Sell Order</span>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] text-indigo-600">Active</span>
                </div>
                <p className="text-[10px] text-neutral-400">Entry: 2345.50</p>
              </div>

              <div className="pl-3 space-y-2 border-l-2 border-neutral-100">
                <div className="flex items-center justify-between">
                  <span>Trade #3: Gold Scalp</span>
                  <span className="h-3.5 w-3.5 rounded-full bg-[#ccff00] flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-black" />
                  </span>
                </div>

                <div className="rounded-lg bg-black text-white p-2 font-medium">
                  Trade #4: Breakout
                </div>

                <div className="text-neutral-500">
                  Trade #5: Pending
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Phone Mockup Frame (Extends outside top and bottom!) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block lg:absolute lg:right-[15%] lg:-top-15 lg:-bottom-15 z-30 w-full max-w-[330px] mx-auto lg:mx-0 h-[550px] lg:h-auto rounded-[2rem] overflow-hidden flex flex-col justify-between"
          >
            {/* Embedded Mockup Image */}
            <div className="relative w-full h-full">
              <Image
                src="/Trade.png"
                alt="Phone Screen App Interface"
                fill
                priority
                className="object-cover rounded-[2rem]"
              />
            </div>
          </motion.div>

          {/* 3. Right Floating Overlay Stack */}
          <div className="hidden lg:flex flex-col gap-4 absolute right-4 xl:right-8 top-12 z-40">
            {/* Top Floating Notification Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-[210px] rounded-2xl bg-white p-3 shadow-xl flex items-center gap-3 text-xs"
            >
              <div className="h-10 w-10 relative rounded-full overflow-hidden shrink-0">
                <Image
                  src="/pfp.png"
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-neutral-400">Trade Executed</p>
                <p className="font-semibold text-neutral-800 text-[11px] truncate">
                  XAUUSD Buy at 2342.15
                </p>
                <span className="text-[9px] text-neutral-400">9:45 AM</span>
              </div>
            </motion.div>

            {/* Bottom Trading Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-[210px] rounded-2xl bg-white p-3 shadow-xl text-xs space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-800 font-semibold">
                <span>Today's Stats</span>
                <button className="flex items-center gap-0.5 text-[9px] border rounded-full px-2 py-0.5 text-neutral-500">
                  <Plus className="h-2.5 w-2.5" /> View
                </button>
              </div>

              <div className="rounded-xl border border-neutral-100 p-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-neutral-800 text-[11px]">Total Trades</p>
                  <p className="text-[9px] text-neutral-400">12 executed</p>
                </div>
                <MoreVertical className="h-3 w-3 text-neutral-400" />
              </div>

              <div className="rounded-xl bg-[#ccff00] p-2 flex justify-between items-center text-black">
                <div>
                  <p className="font-semibold text-[11px]">Profit</p>
                  <p className="text-[9px] text-black/70">+$1,245.00</p>
                </div>
                <MoreVertical className="h-3 w-3 text-black/70" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}