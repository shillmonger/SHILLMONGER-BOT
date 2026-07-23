"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const LEFT_FEATURES = [
  {
    title: "MT4/MT5 Integration",
    desc: "Seamlessly connect your MetaTrader 4 or 5 account to our bot for automated XAUUSD trading execution.",
  },
  {
    title: "Demo Account Testing",
    desc: "Test our bot on demo accounts first to verify performance before committing real capital.",
  },
  {
    title: "Real-Time Execution",
    desc: "Lightning-fast trade execution powered by advanced algorithms that respond to market opportunities instantly.",
  },
];

const RIGHT_FEATURES = [
  {
    title: "Flexible Subscriptions",
    desc: "Choose from multiple subscription plans that match your account size and trading goals.",
  },
  {
    title: "Secure Account Linking",
    desc: "Your broker account credentials are encrypted and never shared. Your security is our top priority.",
  },
  {
    title: "Easy Withdrawals",
    desc: "Withdraw your profits directly to your broker account or preferred payment method at any time.",
  },
];

function FeatureItem({
  title,
  desc,
  align,
}: {
  title: string;
  desc: string;
  align: "left" | "right";
}) {
  const isLeft = align === "left";

  return (
    <div
      className={`group relative flex items-start gap-4 p-6 rounded-xl bg-white border border-neutral-200/80 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer ${
        isLeft ? "lg:flex-row-reverse lg:text-right" : "flex-row text-left"
      }`}
    >
      {/* Text */}
      <div className="flex-1">
        <h3
          className={`${montserrat.className} text-neutral-900 font-bold text-base tracking-tight mb-1.5 transition-colors group-hover:text-indigo-950`}
        >
          {title}
        </h3>
        <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-normal">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="relative mx-auto max-w-[1400px] overflow-hidden py-20 bg-slate-50/50 text-neutral-900 font-sans">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />

      {/* ── SECTION HEADER ── */}
      <div className="relative z-10 text-center px-4 mb-5 max-w-3xl mx-auto">
        <span className="inline-block rounded-full bg-[#ccff00] px-4 py-1 text-xs font-semibold text-black mb-3 shadow-sm">
          Capabilities
        </span>
        <h2
          className={`${montserrat.className} text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900`}
        >
          Core Capabilities
        </h2>
        <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
          Our automated XAUUSD trading bot integrates seamlessly with MT4/MT5, offering flexible subscription plans,
          secure account linking, and real-time execution for consistent trading performance.
        </p>
      </div>

      {/* ── MOBILE LAYOUT (< lg) ── */}
      <div className="lg:hidden relative z-10 px-4 flex flex-col items-center gap-8">
        {/* Center Phone Wrapper */}
        <div className="relative flex justify-center p-2 w-full max-w-[320px]">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
          <Image
            src="/Trade.png"
            alt="SHILLMONGER App"
            width={700}
            height={700}
            className="relative z-10 object-contain max-h-[500px] w-auto rounded-[2.5rem]"
            priority
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (lg+) ── */}
      <div
        className="hidden lg:grid relative z-10 mx-auto max-w-8xl px-8"
        style={{
          gridTemplateColumns: "1fr 380px 1fr",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {/* LEFT FEATURES */}
        <div className="flex flex-col gap-5">
          {LEFT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="left"
            />
          ))}
        </div>

        {/* CENTER PHONE (Framed with Soft Glow) */}
        <div className="relative flex justify-center items-center py-4">
          {/* Subtle Ambient Backlight */}
          <div className="absolute h-[450px] w-[280px] bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-0" />
          
          <Image
            src="/Trade.png"
            alt="SHILLMONGER App"
            width={700}
            height={1400}
            className="relative z-10 object-contain w-[280px] xl:w-[350px] h-auto rounded-[2.5rem] transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>

        {/* RIGHT FEATURES */}
        <div className="flex flex-col gap-5">
          {RIGHT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="right"
            />
          ))}
        </div>
      </div>
    </section>
  );
}