"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
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
      className="flex items-start gap-4 p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
      style={{
        flexDirection: isLeft ? "row-reverse" : "row",
      }}
    >
      {/* Neo-brutalist Square Badges */}
      <div className="shrink-0 mt-0.5 h-7 w-7 rounded-none border-2 border-black bg-black flex items-center justify-center">
        <span className="h-2 w-2 bg-white block" />
      </div>

      {/* Text */}
      <div className={isLeft ? "text-right" : "text-left"}>
        <h3
          className={`${montserrat.className} text-black font-black text-sm uppercase tracking-wider mb-2 leading-none`}
        >
          {title}
        </h3>
        <p className="text-neutral-600 text-xs md:text-sm leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="relative w-full overflow-hidden py-5 text-black font-sans">
      {/* ── SECTION HEADER ── */}
      <div className="relative z-10 text-center px-4">
        <h2
          className={`${montserrat.className} text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-black`}
        >
          Core Capabilities
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Our automated XAUUSD trading bot integrates seamlessly with MT4/MT5, offering flexible subscription plans,
          secure account linking, and real-time execution for consistent trading performance.
        </p>
      </div>

      {/* ── MOBILE LAYOUT (< lg) ── */}
      <div className="lg:hidden relative z-10 px-4 flex flex-col items-center gap-2">
        {/* Center Phone Wrapper with sharp border */}
        <div className="relative flex justify-center p-6 w-full max-w-[320px]">
          <Image
            src="/Trade.png"
            alt="SHILLMONGER App"
            width={700}
            height={700}
            className="relative z-10 object-contain max-h-[900px] w-auto"
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
        className="hidden lg:grid relative z-10 mx-auto max-w-[1400px] px-8 xl:px-12"
        style={{
          gridTemplateColumns: "1fr 420px 1fr",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        {/* LEFT FEATURES */}
        <div className="flex flex-col gap-6 cursor-pointer">
          {LEFT_FEATURES.map((f, i) => (
            <FeatureItem
              key={i}
              title={f.title}
              desc={f.desc}
              align="left"
            />
          ))}
        </div>

        {/* CENTER PHONE (Framed & Structured) */}
        <div className="relative flex justify-center items-center py-4">
          <Image
            src="/Trade.png"
            alt="SHILLMONGER App"
            width={700}
            height={1400}
            className="relative z-10 object-contain grayscale-40 w-[260px] xl:w-[350px] h-auto"
            priority
          />
        </div>

        {/* RIGHT FEATURES */}
        <div className="flex flex-col gap-6 cursor-pointer">
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