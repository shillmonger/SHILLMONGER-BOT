"use client";

import { useRouter } from "next/navigation";
import { Check, Gift, X, Info, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SubscriptionPage() {
  const router = useRouter();

  const commonFeatures = [
    "24/7 Customer Support",
    "Cancel Anytime",
    "Upgrade to Another Plan Anytime",
  ];

  const accessPlans = [
    {
      amount: 10,
      type: "Basic Plan",
      accountSize: "$50 – $200",
      duration: "5 Days",
      lotSize: "0.01",
      maxTrades: 5,
      targetLabel: "Up to 40%",
      tradingVolume: "Entry Level",
      headerBg: "bg-gradient-to-b from-orange-950/40 via-neutral-900/30 to-transparent",
      accent: "text-orange-300",
      accentBg: "bg-orange-500/10",
      iconGrad: "from-orange-800 to-orange-950",
      popular: false,
      btnClass:
        "bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-950/50",
      planFeatures: [
        "Maximum 5 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.01",
        "Duration: 5 Days",
      ],
      note:
        "The bot only trades when a valid trading opportunity is detected, so the target is not guaranteed within the subscription period. Quality entries are prioritized over trade frequency.",
    },
    {
      amount: 20,
      type: "Standard Plan",
      accountSize: "$200 – $500",
      duration: "14 Days",
      lotSize: "0.02",
      maxTrades: 10,
      targetLabel: "Up to 60%",
      tradingVolume: "Enhanced",
      headerBg: "bg-gradient-to-b from-indigo-900/50 via-indigo-950/20 to-transparent",
      accent: "text-indigo-400",
      accentBg: "bg-indigo-500/15",
      iconGrad: "from-indigo-500 to-indigo-700",
      popular: true,
      btnClass:
        "bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-950/50",
      planFeatures: [
        "Maximum 10 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.02",
        "Duration: 14 Days",
      ],
      note:
        "The bot only trades when valid opportunities are available, so the target is not guaranteed. Trades are never forced simply to reach it.",
    },
    {
      amount: 50,
      type: "Pro Plan",
      accountSize: "$500 – $1,000",
      duration: "1 Month",
      lotSize: "0.03",
      maxTrades: 10,
      targetLabel: "Unlimited",
      tradingVolume: "Institutional",
      headerBg: "bg-gradient-to-b from-rose-950/40 via-neutral-900/30 to-transparent",
      accent: "text-rose-300",
      accentBg: "bg-rose-500/10",
      iconGrad: "from-rose-800 to-rose-950",
      popular: false,
      btnClass:
        "bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-950/50",
      planFeatures: [
        "Maximum 10 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.03",
        "Duration: 1 Month",
      ],
      note:
        "Unlike the Basic and Standard plans, the Pro Plan has no profit cap. The bot trades for the full subscription period whenever valid opportunities exist; profits depend entirely on market conditions and are not guaranteed.",
    },
  ];

  const comparisonData = [
    {
      metric: "Execution Speed",
      manual: "Slow, limited by human reaction",
      automated: "Instant, algorithmic execution",
    },
    {
      metric: "Strategy",
      manual: "Driven by greed and FOMO",
      automated: "Guided by predefined rules",
    },
    {
      metric: "Consistency",
      manual: "Depends on mood and focus",
      automated: "Stable and rules-based",
    },
    {
      metric: "Availability",
      manual: "Active only when the trader is online",
      automated: "Runs 24/5 without interruptions",
    },
    {
      metric: "Setup & Ease",
      manual: "Complex analysis and a steep learning curve",
      automated: "AI Presets with ready-made GRID/DCA setups",
    },
  ];

  const handleSelectPlan = (plan: string, amount: number) => {
    router.push("/auth-page/login");
  };

  return (
    <main className="min-h-screen flex flex-col text-black font-sans pb-24">
      {/* Hero Header */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-10 pt-24 pb-10 text-center">
        {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold tracking-wide mb-6 text-neutral-300 shadow-sm">
          <Gift className="w-3.5 h-3.5 text-indigo-500" />
          <span>Premium Trading Bot Plans</span>
        </div> */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-black">
          Bot Subscription
        </h1>

        <p className="text-neutral-500 max-w-2xl text-sm md:text-base leading-relaxed mx-auto font-normal">
          Pick the subscription that matches your trading account size. Every plan
          includes automated trading, 24/7 customer support, upgrade flexibility,
          and risk-managed execution designed for your selected package.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-10 lg:pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-center">
          {accessPlans.map((plan, i) => (
            <Card
              key={i}
              className={`flex flex-col justify-between rounded-3xl transition-all duration-300 overflow-hidden relative backdrop-blur-md border bg-black text-neutral-50
                ${
                  plan.popular
                    ? "lg:scale-[1.06] z-10 border-indigo-900/60 shadow-2xl shadow-indigo-950/60 ring-1 ring-indigo-500/40 py-4 lg:py-6"
                    : "border-neutral-900 shadow-xl py-2 opacity-95 hover:opacity-100"
                }
                hover:border-neutral-800 group
              `}
            >
              {/* Background Glow / Top Gradient Accent */}
              <div className={`absolute top-0 inset-x-0 h-40 ${plan.headerBg} pointer-events-none`} />

              {/* Header */}
              <CardHeader className="px-7 pt-7 pb-2 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  {/* Brand Circular Icon */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${plan.iconGrad} p-0.5 flex items-center justify-center shadow-lg`}>
                    <div className="w-full h-full bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {plan.popular && (
                    <div className="bg-indigo-600/90 border border-indigo-500/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full shadow-sm shadow-indigo-950/50">
                      Most popular
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {plan.type}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Account Size {plan.accountSize} &middot; {plan.duration}
                  </p>
                </div>

                <div className="pt-2 flex items-baseline gap-1">
                  <CardTitle className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                    ${plan.amount.toLocaleString()}
                  </CardTitle>
                  <span className="text-xs text-neutral-400 font-medium">
                    /{plan.duration.toLowerCase()}
                  </span>
                </div>
              </CardHeader>

              {/* Action Button */}
              <div className="px-7 py-4 relative z-10">
                <button
                  onClick={() => handleSelectPlan(plan.type, plan.amount)}
                  className={`w-full cursor-pointer text-sm py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnClass}`}
                >
                  <span>Choose this plan</span>
                </button>
              </div>

              {/* Body Content */}
              <CardContent className="px-7 pb-7 pt-2 flex-grow flex flex-col justify-between gap-6 relative z-10">
                {/* Stats row */}
                <div className="space-y-3 pt-2 border-t border-neutral-900">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-medium">Target Profit</span>
                    <span className={`font-semibold px-2.5 py-0.5 rounded-md text-[11px] ${plan.accentBg} ${plan.accent}`}>
                      {plan.targetLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-medium">Lot Size & Max Trades</span>
                    <span className="text-neutral-200 font-semibold">
                      {plan.lotSize} &middot; {plan.maxTrades} trades
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 border-t border-neutral-900 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Plan Features
                  </p>
                  <ul className="space-y-2.5">
                    {[...commonFeatures, ...plan.planFeatures].map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="shrink-0 w-4 h-4 rounded-full bg-neutral-900 flex items-center justify-center mt-0.5">
                          <Check className="w-2.5 h-2.5 text-indigo-400 stroke-[3]" />
                        </div>
                        <span className="text-xs text-neutral-300 font-normal leading-tight">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important note */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-900">
                  <Info className={`w-4 h-4 shrink-0 mt-0.5 ${plan.accent}`} />
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-normal">
                    {plan.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 px-6 py-4 border border-neutral-900 bg-neutral-900 backdrop-blur-sm rounded-2xl">
          <p className="text-xs text-neutral-300 leading-relaxed font-normal text-center">
            <span className="font-semibold text-neutral-100">Disclaimer: </span>
            Trading in the financial markets involves risk, and profits cannot be guaranteed. Our bot only
            executes trades when predefined trading conditions are met. It does not force trades during
            unfavorable market conditions. Past performance does not guarantee future results. Users should
            only trade with funds they can afford to risk.
          </p>
        </div>
      </section>

      {/* Comparison Section (Automated vs Manual) */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-6 w-full">
        <div className="max-w-3xl mx-auto pb-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black mb-3">
            Automated vs Manual
          </h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed mx-auto font-normal">
            Choose a plan and let our advanced trading systems work for you.
            Earnings topped up automatically every 24 hours.
          </p>
        </div>

        {/* Flat Modern Container Table */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-3 border-b border-neutral-200 bg-neutral-200 p-5 text-xs font-bold uppercase tracking-wider">
            <div className="text-neutral-800">Metric</div>
            <div className="text-rose-600">Manual Trading</div>
            <div className="text-emerald-600">Automated Trading</div>
          </div>

          {/* Table Body rows */}
          <div className="divide-y divide-neutral-200">
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 p-5 gap-3 md:gap-4 items-center hover:bg-neutral-50 transition-colors"
              >
                {/* Metric Label */}
                <div className="text-sm font-semibold text-neutral-800">
                  {row.metric}
                </div>

                {/* Manual Column */}
                <div className="flex items-start gap-2.5 md:pr-4">
                  <span className="md:hidden text-xs font-semibold text-rose-600 block mb-1">
                    Manual:
                  </span>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 stroke-[2.5] text-rose-600 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-neutral-600 font-normal leading-relaxed">
                      {row.manual}
                    </span>
                  </div>
                </div>

                {/* Automated Column */}
                <div className="flex items-start gap-2.5">
                  <span className="md:hidden text-xs font-semibold text-emerald-600 block mb-1">
                    Automated:
                  </span>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 stroke-[2.5] text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-neutral-800 font-medium leading-relaxed">
                      {row.automated}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}