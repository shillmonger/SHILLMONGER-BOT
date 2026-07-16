"use client";

import { useRouter } from "next/navigation";
import { Check, BarChart3, Gift, X, Info } from "lucide-react";
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
      color: "from-emerald-500/15 to-emerald-500/5",
      border: "border-neutral-800",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-500/10",
      popular: false,
      planFeatures: [
        "Maximum 5 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.01",
        "Duration: 5 Days",
      ],
      note:
        "The bot only trades when a valid trading opportunity is detected, so the 100% target is not guaranteed within the subscription period. Quality entries are prioritized over trade frequency.",
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
      color: "from-purple-500/15 to-purple-500/5",
      border: "border-neutral-500/45",
      accent: "text-purple-400",
      accentBg: "bg-purple-500/10",
      popular: true,
      planFeatures: [
        "Maximum 10 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.02",
        "Duration: 14 Days",
      ],
      note:
        "The bot only trades when valid opportunities are available, so the 100% target is not guaranteed. Trades are never forced simply to reach the target.",
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
      color: "from-orange-500/15 to-orange-500/5",
      border: "border-neutral-800",
      accent: "text-orange-400",
      accentBg: "bg-orange-500/10",
      popular: false,
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
    <main className="min-h-screen flex flex-col text-neutral-50 font-sans pb-24">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 lg:px-10 pt-24 pb-10 text-center mt-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-neutral-900 border-2 border-neutral-800 text-[10px] font-black uppercase tracking-[.25em] mb-6 text-neutral-50">
          <Gift className="w-3.5 h-3.5" />
          Premium Trading Bot Plans
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-4xl text-black font-black uppercase tracking-tighter leading-none mb-2">
          Bot Subscription
        </h1>

        <p className="text-neutral-600 max-w-2xl text-sm md:text-base leading-relaxed mx-auto font-medium">
          Pick the subscription that matches your trading account size. Every plan
          includes automated trading, 24/7 customer support, upgrade flexibility,
          and risk-managed execution designed for your selected package.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-10 pb-10 lg:pb-14 w-full">
        {/* lg:items-center vertically aligns side cards against the taller middle card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch lg:items-center">
          {accessPlans.map((plan, i) => (
            <Card
              key={i}
              className={`flex flex-col justify-between bg-neutral-950 rounded-none transition-all duration-300 overflow-hidden relative border
                ${plan.popular
                  ? "ring-2 ring-neutral-50 ring-offset-2 ring-offset-black shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] lg:scale-[1.04] z-10 border-transparent py-10"
                  : `${plan.border} shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] py-6`
                }
                hover:border-neutral-50/60 hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] group
              `}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${plan.color}`} />

              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-neutral-50 text-neutral-950 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Header */}
              <CardHeader className={`px-6 pb-3 ${plan.popular ? "pt-10" : "pt-6"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${plan.accent}`}>
                    {plan.type}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-none border border-neutral-800 ${plan.accentBg} ${plan.accent}`}>
                    {plan.targetLabel}
                  </span>
                </div>
                <CardTitle className="text-4xl font-black tracking-tighter text-neutral-50">
                  ${plan.amount.toLocaleString()}
                </CardTitle>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-semibold">
                  Account Size {plan.accountSize} &middot; {plan.duration}
                </p>
              </CardHeader>

              {/* Body */}
              <CardContent className="px-6 pb-6 flex-grow flex flex-col gap-5">
                {/* Key stats row */}
                <div className={`flex justify-between items-center px-3.5 py-3 rounded-none bg-gradient-to-br ${plan.color} border border-neutral-800`}>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                    Lot Size &middot; Max Trades
                  </span>
                  <span className={`text-sm font-black ${plan.accent}`}>
                    {plan.lotSize} &middot; {plan.maxTrades}
                  </span>
                </div>

                {/* Benefits */}
                <div className="border-t-2 border-dashed border-neutral-800 pt-5">
                  <p className="text-[9px] font-black uppercase text-neutral-400 mb-3 tracking-[0.2em]">
                    Guarantees & Inclusions
                  </p>
                  <ul className="space-y-2.5">
                    {[...commonFeatures, ...plan.planFeatures].map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="shrink-0 w-4 h-4 border border-neutral-800 bg-neutral-950 flex items-center justify-center rounded-none mt-0.5">
                          <Check className={`w-3 h-3 stroke-[3] ${plan.accent}`} />
                        </div>
                        <span className="text-[11px] text-neutral-400 font-semibold leading-tight">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important note */}
                <div className="flex items-start gap-2 px-3 py-2.5 border border-neutral-800 bg-neutral-900/60">
                  <Info className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.accent}`} />
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                    {plan.note}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSelectPlan(plan.type, plan.amount)}
                  className="mt-auto w-full cursor-pointer font-black text-xs uppercase tracking-wider py-3.5 rounded-none transition-all duration-300 flex items-center justify-center gap-2 bg-neutral-50 hover:bg-neutral-200 text-neutral-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  <span>Subscribe Now</span>
                  {/* <BarChart3 className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-200" /> */}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-10 px-5 py-4 border border-neutral-800 bg-neutral-950 rounded-none">
          <p className="text-[10px] text-neutral-500 leading-relaxed font-medium text-center">
            <span className="font-black text-neutral-300 uppercase tracking-widest">Disclaimer: </span>
            Trading in the financial markets involves risk, and profits cannot be guaranteed. Our bot only
            executes trades when predefined trading conditions are met. It does not force trades during
            unfavorable market conditions. Past performance does not guarantee future results. Users should
            only trade with funds they can afford to risk.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-5 mt-4 w-full">
        <section className="max-w-7xl mx-auto px-4 lg:px-10 pb-5 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-black uppercase tracking-tighter text-center mb-2 leading-none">
            Automated vs Manual
          </h2>
          <p className="text-neutral-600 max-w-lg text-sm md:text-base leading-relaxed mx-auto font-medium">
            Choose a plan and let our advanced trading systems work for you.
            Earnings topped up automatically every 24 hours.
          </p>
        </section>

        {/* Flat Brutalist Container Table */}
        <div className="bg-white border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-3 border-b-2 border-black bg-neutral-100 p-6 text-xs font-black uppercase tracking-widest">
            <div className="text-black">Metric</div>
            <div className="text-rose-500">Manual Trading</div>
            <div className="text-emerald-500">Automated Trading</div>
          </div>

          {/* Table Body rows */}
          <div className="divide-y-2 divide-black/60">
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 p-5 md:p-6 gap-3 md:gap-4 items-center bg-white hover:bg-neutral-50 transition-colors"
              >
                {/* Metric Label */}
                <div className="text-sm font-black uppercase tracking-tight text-black">
                  {row.metric}
                </div>

                {/* Manual Column */}
                <div className="flex items-start gap-2.5 md:pr-4">
                  <span className="md:hidden text-[10px] font-black uppercase tracking-wider text-rose-500 block mb-1">
                    Manual:
                  </span>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 stroke-[3] text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                      {row.manual}
                    </span>
                  </div>
                </div>

                {/* Automated Column */}
                <div className="flex items-start gap-2.5">
                  <span className="md:hidden text-[10px] font-black uppercase tracking-wider text-emerald-500 block mb-1">
                    Elirox Auto:
                  </span>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 stroke-[3] text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-neutral-900 font-semibold leading-relaxed">
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