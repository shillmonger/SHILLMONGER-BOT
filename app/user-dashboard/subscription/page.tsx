"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Gift, X, Info, ShieldCheck, Copy, Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      color: "border-emerald-500",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-500/10 border-emerald-500/20",
      popular: false,
      planFeatures: [
        "Maximum 5 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.01",
        "Duration: 5 Days",
      ],
      note: "The bot only trades when a valid trading opportunity is detected, so the 100% target is not guaranteed within the subscription period. Quality entries are prioritized over trade frequency.",
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
      color: "border-purple-500",
      accent: "text-purple-400",
      accentBg: "bg-purple-500/10 border-purple-500/20",
      popular: true,
      planFeatures: [
        "Maximum 10 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.02",
        "Duration: 14 Days",
      ],
      note: "The bot only trades when valid opportunities are available, so the 100% target is not guaranteed. Trades are never forced simply to reach the target.",
    },
    {
      amount: 50,
      type: "Pro Plan",
      accountSize: "$500 – $10K",
      duration: "1 Month",
      lotSize: "0.03",
      maxTrades: 10,
      targetLabel: "Unlimited",
      tradingVolume: "Institutional",
      color: "border-orange-500",
      accent: "text-orange-400",
      accentBg: "bg-orange-500/10 border-orange-500/20",
      popular: false,
      planFeatures: [
        "Maximum 10 Open Trades",
        "Unlimited Profit Potential",
        "Lot Size: 0.03",
        "Duration: 1 Month",
      ],
      note: "Unlike the Basic and Standard plans, the Pro Plan has no profit cap. The bot trades for the full subscription period whenever valid opportunities exist; profits depend entirely on market conditions and are not guaranteed.",
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

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmitTransfer = async () => {
    if (!screenshotFile) {
      toast.error("Please upload a screenshot of your transfer");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      formData.append('planType', selectedPlan.type);
      formData.append('amount', selectedPlan.amount.toString());
      formData.append('accountSize', selectedPlan.accountSize);
      formData.append('duration', selectedPlan.duration);
      formData.append('lotSize', selectedPlan.lotSize);
      formData.append('maxTrades', selectedPlan.maxTrades.toString());
      formData.append('targetLabel', selectedPlan.targetLabel);
      formData.append('tradingVolume', selectedPlan.tradingVolume);

      const response = await fetch('/api/user/subscription/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Transfer screenshot submitted successfully. Verification takes about 5 minutes.");
        setShowModal(false);
        setScreenshotFile(null);
      } else {
        toast.error(data.error || 'Failed to submit transfer screenshot');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit transfer screenshot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-8">
          
          {/* ====================================================
              SECTION 1: HERO HEADER (Matching Dashboard Section 1)
              ==================================================== */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-black pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Premium Bot Plans
                </span>
              </div>
              <h1 className="text-4xl md:text-3xl font-mono font-black uppercase text-neutral-950 mb-2">
                Subscription
              </h1>
            </div>
            <div className="bg-neutral-950 text-white border-2 border-black px-4 py-2 text-right shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                Risk Engine
              </span>
              <span className="text-xs font-mono font-bold flex items-center gap-1.5 justify-end">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secure Checkout
              </span>
            </div>
          </div>

          {/* ====================================================
              SECTION 2: PLANS GRID (Matching Dashboard Stats Cards)
              ==================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {accessPlans.map((plan, i) => (
              <Card 
                key={i} 
                className={`rounded-none bg-neutral-950 text-white border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden ${
                  plan.popular ? "border-white ring-2 ring-black" : "border-black"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-white text-neutral-950 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                      Most Popular
                    </div>
                  </div>
                )}

                <CardContent className="p-6 flex flex-col gap-5 flex-grow">
                  {/* Card Header stats */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${plan.accent}`}>
                        {plan.type}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                        Acc. Size: {plan.accountSize}
                      </span>
                    </div>
                    <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 border ${plan.accentBg} ${plan.accent}`}>
                      Target: {plan.targetLabel}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="border-b border-neutral-800 pb-3">
                    <span className="text-4xl font-black font-mono tracking-tight text-white">
                      ${plan.amount.toLocaleString()}
                    </span>
                    <span className="text-neutral-400 font-mono text-xs ml-1">/ {plan.duration}</span>
                  </div>

                  {/* Config Row */}
                  <div className="p-3 bg-neutral-900 border border-neutral-800 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Lot Size & Max Trades</span>
                    <span className={`font-mono text-sm font-black ${plan.accent}`}>
                      {plan.lotSize} &middot; {plan.maxTrades} max
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 flex-grow">
                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Guarantees & Inclusions</p>
                    <ul className="space-y-2">
                      {[...commonFeatures, ...plan.planFeatures].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="shrink-0 w-4 h-4 border border-neutral-800 bg-neutral-900 flex items-center justify-center mt-0.5">
                            <Check className={`w-3 h-3 stroke-[3] ${plan.accent}`} />
                          </div>
                          <span className="text-[11px] text-neutral-300 font-mono leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Important Note */}
                  <div className="flex items-start gap-2 p-3 bg-neutral-900/60 border border-neutral-850">
                    <Info className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.accent}`} />
                    <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                      {plan.note}
                    </p>
                  </div>

                  {/* CTA button (Matching your dashboard neobrutalist look) */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3.5 rounded-none transition-all duration-300 flex items-center justify-center bg-white hover:bg-neutral-200 text-neutral-950 border border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]"
                  >
                    Subscribe Now
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>


          {/* ====================================================
              SECTION 3: DISCLAIMER CARD
              ==================================================== */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-4">
              <p className="text-[10px] text-neutral-500 leading-relaxed font-mono text-center">
                <span className="font-black text-neutral-300 uppercase tracking-widest">Disclaimer: </span>
                Trading in the financial markets involves risk, and profits cannot be guaranteed. Our bot only
                executes trades when predefined trading conditions are met. It does not force trades during
                unfavorable market conditions. Past performance does not guarantee future results. Users should
                only trade with funds they can afford to risk.
              </p>
            </CardContent>
          </Card>


          {/* ====================================================
              SECTION 4: AUTOMATED VS MANUAL COMPARISON TABLE
              ==================================================== */}
          <div className="space-y-4 pt-4">
            <div className="border-b-2 border-black pb-2">
              <h2 className="text-lg font-black uppercase font-mono tracking-tighter">
                Automated vs Manual
              </h2>
              <p className="text-xs text-neutral-600 font-semibold mt-1">
                Choose a plan and let our advanced trading systems work for you.
              </p>
            </div>

            {/* Flat Brutalist Container Table */}
            <div className="bg-neutral-950 border-2 border-black text-white rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Header Row */}
              <div className="hidden md:grid grid-cols-3 border-b border-neutral-800 bg-neutral-900 p-4 text-[10px] font-black uppercase tracking-widest font-mono">
                <div className="text-neutral-400">Metric</div>
                <div className="text-rose-400">Manual Trading</div>
                <div className="text-emerald-400">Automated Trading</div>
              </div>

              {/* Table Body rows */}
              <div className="divide-y divide-neutral-900">
                {comparisonData.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 p-4 gap-3 md:gap-4 items-center bg-neutral-950/40 hover:bg-neutral-900/40 transition-colors"
                  >
                    {/* Metric Label */}
                    <div className="text-xs font-black uppercase font-mono tracking-tight text-white">
                      {row.metric}
                    </div>

                    {/* Manual Column */}
                    <div className="flex items-start gap-2">
                      <span className="md:hidden text-[9px] font-black uppercase tracking-wider text-rose-500 block mr-1 font-mono">
                        Manual:
                      </span>
                      <div className="flex items-start gap-1.5">
                        <X className="w-3.5 h-3.5 stroke-[3] text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-400 font-mono leading-relaxed">
                          {row.manual}
                        </span>
                      </div>
                    </div>

                    {/* Automated Column */}
                    <div className="flex items-start gap-2">
                      <span className="md:hidden text-[9px] font-black uppercase tracking-wider text-emerald-500 block mr-1 font-mono">
                        Bot:
                      </span>
                      <div className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-200 font-semibold font-mono leading-relaxed">
                          {row.automated}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-white rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 cursor-pointer text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  Complete Payment
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  Transfer funds to activate your {selectedPlan.type}
                </p>
              </div>

              {/* Plan Summary */}
              <div className="p-4 bg-neutral-900 border border-neutral-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Selected Plan</p>
                    <p className="text-lg font-black text-white">{selectedPlan.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Amount to Transfer</p>
                    <p className="text-2xl font-black text-emerald-400">${selectedPlan.amount}</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Transfer to Account</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800">
                    <div>
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Account Number</p>
                      <p className="text-sm font-mono font-bold text-white">130844969</p>
                    </div>
                    <button
                      onClick={() => handleCopy("130844969", "Account number")}
                      className="cursor-pointer p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800">
                    <div>
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Account Email</p>
                      <p className="text-sm font-mono font-bold text-white">codelab042@gmail.com</p>
                    </div>
                    <button
                      onClick={() => handleCopy("codelab042@gmail.com", "Account email")}
                      className="cursor-pointer p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transfer Instructions */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">How to Transfer</p>
                <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-3">
                  <ol className="space-y-2 text-xs text-neutral-300 font-mono leading-relaxed list-decimal list-inside">
                    <li>Go to your Exness real account</li>
                    <li>Click on transfer button</li>
                    <li>Select "Transfer to another user"</li>
                    <li>Add the recipient account number: <span className="text-emerald-400">130844969</span></li>
                    <li>Add recipient email address: <span className="text-emerald-400">codelab042@gmail.com</span></li>
                    <li>Enter amount <span className="text-emerald-400">${selectedPlan.amount}</span> and proceed</li>
                    <li>On success, take a screenshot and come back to this site</li>
                  </ol>
                </div>
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Upload Transfer Screenshot</p>
                <div className="p-4 bg-neutral-900 border border-neutral-800">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-700 hover:border-neutral-500 cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 text-neutral-500 mb-2" />
                    <p className="text-xs text-neutral-400 text-center">
                      {screenshotFile ? screenshotFile.name : "Click to upload screenshot"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Verification Info */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Verification Process</p>
                  <p className="text-xs text-neutral-300 font-semibold leading-relaxed">
                    Verification takes about 5 minutes. If verification exceeds this time, contact us on Telegram: <span className="text-emerald-400">@shillmonger0</span>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitTransfer}
                disabled={isSubmitting || !screenshotFile}
                className="w-full cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-4 rounded-none transition-all duration-300 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "I Have Made This Transfer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}