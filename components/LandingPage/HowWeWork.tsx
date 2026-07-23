"use client";
// components/landing-page/why-platform-section.tsx
import {
  UserPlus,
  CreditCard,
  Link as LinkIcon,
  TestTubeDiagonal,
  ArrowUpFromLine,
  RefreshCw,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

export default function WhyPlatformSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      step: "01",
      title: "Create Account",
      desc: "Join SHILLMONGER in seconds. Our registration is fast, encrypted, and built to protect your identity from day one.",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      step: "02",
      title: "Connect & Test Demo",
      desc: "Connect and test on a demo account first to ensure everything works perfectly before using real funds.",
      icon: <TestTubeDiagonal className="w-5 h-5" />,
    },
    {
      step: "03",
      title: "Buy Bot Subscription",
      desc: "Purchase a bot subscription plan that suits your trading goals and budget.",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      step: "04",
      title: "Fund & Connect MT5",
      desc: "Fund real money on your broker, connect to MT5 and link it to your account for automated trading.",
      icon: <LinkIcon className="w-5 h-5" />,
    },
    {
      step: "05",
      title: "Withdraw Profits",
      desc: "Withdraw your profits at the end of your subscription period to your preferred payment method.",
      icon: <ArrowUpFromLine className="w-5 h-5" />,
    },
    {
      step: "06",
      title: "Renew or Upgrade",
      desc: "At the end of each subscription, buy a new one or upgrade to continue using our bot and maximize your trading potential.",
      icon: <RefreshCw className="w-5 h-5" />,
    },
  ];

  return (
    <section
      id="why-this-platform"
      className="mx-auto max-w-[1400px] px-4 lg:px-8  w-full text-neutral-900 font-sans"
    >
      {/* Header */}
      <div className="mb-10 text-left max-w-xl">
        <span className="inline-block rounded-full bg-[#ccff00] px-4 py-1 text-xs font-semibold text-black mb-3">
          Workflow
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900">
          How It Works
        </h2>

        <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
          A streamlined 6-step journey — from sign-up to subscription renewal with
          institutional-grade efficiency.
        </p>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            isActive={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {steps.map((step, i) => (
              <CarouselItem key={i}>
                <div className="p-1">
                  <StepCard step={step} isActive={i === activeIndex} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-4">
            <CarouselPrevious className="static translate-y-0 w-10 h-10 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-200 rounded-full text-neutral-800 transition-all shadow-sm" />
            <CarouselNext className="static translate-y-0 w-10 h-10 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-200 rounded-full text-neutral-800 transition-all shadow-sm" />
          </div>
        </Carousel>
      </div>

      {/* Footer Divider */}
      <div className="mt-16 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-neutral-200" />
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold whitespace-nowrap">
          Start your journey today
        </span>
        <div className="h-[1px] flex-1 bg-neutral-200" />
      </div>
    </section>
  );
}

// ─── Step Card Sub-component ──────────────────────────────────────────────────

type Step = {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

function StepCard({
  step,
  isActive,
  onMouseEnter,
}: {
  step: Step;
  isActive: boolean;
  onMouseEnter?: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`group relative rounded-3xl p-7 transition-all duration-300 cursor-pointer border ${
        isActive
          ? "bg-white border-indigo-200 shadow-xl shadow-indigo-500/10 -translate-y-1.5"
          : "bg-white/60 hover:bg-white border-neutral-200/80 hover:border-neutral-300 shadow-sm"
      }`}
    >
      {/* Step Badge + Icon Header */}
      <div className="flex items-center justify-between mb-6">
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
            isActive
              ? "bg-[#ccff00] text-black"
              : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
          }`}
        >
          Step {step.step}
        </span>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30"
              : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white"
          }`}
        >
          {step.icon}
        </div>
      </div>

      {/* Title & Description */}
      <h3
        className={`font-bold text-lg tracking-tight mb-2.5 transition-colors ${
          isActive ? "text-indigo-950" : "text-neutral-800"
        }`}
      >
        {step.title}
      </h3>
      <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
        {step.desc}
      </p>
    </div>
  );
}