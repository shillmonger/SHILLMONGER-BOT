"use client";
// components/landing-page/why-platform-section.tsx
import {
  UserPlus,
  CreditCard,
  Link,
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
      icon: <UserPlus className="w-[18px] h-[18px]" />,
    },
    {
      step: "02",
      title: "Connect & Test Demo",
      desc: "Connect and test on a demo account first to ensure everything works perfectly before using real funds.",
      icon: <TestTubeDiagonal className="w-[18px] h-[18px]" />,
    },
    {
      step: "03",
      title: "Buy Bot Subscription",
      desc: "Purchase a bot subscription plan that suits your trading goals and budget.",
      icon: <CreditCard className="w-[18px] h-[18px]" />,
    },
    {
      step: "04",
      title: "Fund & Connect MT5",
      desc: "Fund real money on your broker, connect to MT5 and link it to your account for automated trading.",
      icon: <Link className="w-[18px] h-[18px]" />,
    },
    {
      step: "05",
      title: "Withdraw Profits",
      desc: "Withdraw your profits at the end of your subscription period to your preferred payment method.",
      icon: <ArrowUpFromLine className="w-[18px] h-[18px]" />,
    },
    {
      step: "06",
      title: "Renew or Upgrade",
      desc: "At the end of each subscription, buy a new one or upgrade to continue using our bot and maximize your trading potential.",
      icon: <RefreshCw className="w-[18px] h-[18px]" />,
    },
  ];

  // Auto-cycle hover effect every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section
      id="why-this-platform"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-10 w-full text-black font-sans"
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-black">
          How It Works
        </h2>

        <p className="text-neutral-600 max-w-lg text-sm md:text-base leading-relaxed">
          A streamlined 6-step journey — from sign-up to subscription renewal with
          institutional-grade efficiency.
        </p>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} isActive={index === activeIndex} index={index} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {steps.map((step, i) => (
              <CarouselItem key={i}>
                <div className="p-1">
                  <StepCard step={step} isActive={i === activeIndex} index={i} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-6">
            <CarouselPrevious className="static translate-y-0 w-12 h-12 bg-white hover:bg-black hover:text-white border-2 border-black rounded-none text-black transition-colors duration-300" />
            <CarouselNext className="static translate-y-0 w-12 h-12 bg-white hover:bg-black hover:text-white border-2 border-black rounded-none text-black transition-colors duration-300" />
          </div>
        </Carousel>
      </div>

      {/* Footer rule */}
      <div className="mt-5 flex items-center gap-4">
        <div className="h-[2px] flex-1 bg-black" />
        <span className="text-[11px] uppercase tracking-widest text-black font-black whitespace-nowrap">
          Start your journey today
        </span>
        <div className="h-[2px] flex-1 bg-black" />
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

function StepCard({ step, isActive, index }: { step: Step; isActive: boolean; index: number }) {
  const isDark = index % 2 === 0;
  const cardClassName = `group relative rounded-none border-2 p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
    isDark
      ? "border-white bg-neutral-950"
      : "border-black bg-white"
  } ${!isDark && isActive ? "-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""}`;
  const iconClassName = `flex h-10 w-10 items-center justify-center rounded-none border-2 transition-all duration-300 ml-auto ${
    isDark
      ? isActive
        ? "bg-white text-black border-white"
        : "bg-neutral-900 text-white border-white"
      : isActive
        ? "bg-black text-white border-black"
        : "bg-white text-black border-black"
  }`;
  const labelClassName = `text-[11px] font-black uppercase tracking-widest absolute left-0 top-0 px-3 py-1.5 ${
    isDark ? "text-black bg-white border-b border-r border-white" : "text-white bg-neutral-900 border-b border-r border-black"
  }`;
  const titleClassName = `font-black text-sm uppercase tracking-wider mb-2 transition-colors duration-300 mt-2 ${
    isDark ? "text-white group-hover:text-neutral-200" : "text-black group-hover:text-neutral-700"
  }`;
  const descClassName = `text-xs leading-relaxed font-medium ${
    isDark ? "text-neutral-400" : "text-neutral-600"
  }`;

  return (
    <div className={cardClassName}>
      
      {/* Step label + Icon */}
      <div className="flex items-start justify-between mb-6">
        <span className={labelClassName}>
          Step {step.step}
        </span>
        <div className={iconClassName}>
          {step.icon}
        </div>
      </div>

      {/* Text */}
      <h3 className={titleClassName}>
        {step.title}
      </h3>
      <p className={descClassName}>
        {step.desc}
      </p>
    </div>
  );
}