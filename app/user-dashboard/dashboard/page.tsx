"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  Percent, 
  ArrowRightLeft
} from "lucide-react";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Welcome");
  const [currentTime, setCurrentTime] = useState("");

  // Mocked user data (replace with actual auth data when available)
  const userData = {
    username: "shillmonger",
  };

  // Statistics Cards Data
  const statsCards = [
    {
      label: "Account Balance",
      icon: Wallet,
      iconColor: "text-neutral-400",
      value: "$2,540.75",
      valueColor: "text-white",
      subtitle: "Available Equity",
    },
    {
      label: "Today's Profit",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      value: "+$125.42",
      valueColor: "text-emerald-400",
      subtitle: "Today's Performance",
    },
    {
      label: "Total Profit",
      icon: ArrowUpRight,
      iconColor: "text-emerald-400",
      value: "+$3,824.60",
      valueColor: "text-emerald-400",
      subtitle: "Lifetime Earnings",
    },
    {
      label: "Withdrawals",
      icon: DollarSign,
      iconColor: "text-neutral-400",
      value: "$1,250.00",
      valueColor: "text-white",
      subtitle: "Successfully Withdrawn",
    },
  ];

  useEffect(() => {
    // Set greeting based on time of day
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good Morning");
    else if (hrs < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Set dynamic formatted date/time
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    setCurrentTime(new Date().toLocaleDateString("en-US", options));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-8">
          
          {/* ====================================================
              SECTION 1: WELCOME & PERFORMANCE OVERVIEW
             ==================================================== */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-black pb-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
                {greeting},
              </p>
              <h1 className="text-4xl md:text-3xl font-mono font-black uppercase text-neutral-950 mb-2">
                {userData.username}
              </h1>
              {/* <p className="text-sm text-neutral-600 font-semibold max-w-xl leading-relaxed">
                Monitor your trading performance, account status, and AI trading activity in real time.
              </p> */}
            </div>
            <div className="bg-neutral-950 text-white border-2 border-black px-4 py-2 text-right shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                System Time
              </span>
              <span className="text-xs font-mono font-bold">
                {currentTime || "July 16, 2026"}
              </span>
            </div>
          </div>




          {/* ====================================================
              SECTION 2: STATISTICS CARDS
             ==================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
              <Card key={index} className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="px-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {card.label}
                    </span>
                    <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                  <div className={`text-2xl font-black font-mono tracking-tight ${card.valueColor} mb-1`}>
                    {card.value}
                  </div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {card.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>




          {/* GRID LAYOUT FOR STATUS, HISTORY & PERFORMANCE */}
          <div className="flex flex-col gap-6">

            {/* ====================================================
                SECTION 3: TRADING ENGINE STATUS (1 Column Wide)
               ==================================================== */}
            <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <CardContent className="p-6 space-y-6">
                <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                  <h2 className="text-lg font-black uppercase tracking-tighter">
                    Trading Engine Status
                  </h2>
                  <Activity className="h-4 w-4 text-neutral-400 animate-pulse" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                  {/* Status Rows */}
                  {[
                    { label: "AI Engine", value: "Active", positive: true },
                    { label: "MT5 Connection", value: "Connected", positive: true },
                    { label: "Market Status", value: "Open", positive: true },
                    { label: "Auto Trading", value: "Enabled", positive: true },
                    { label: "Risk Management", value: "Active", positive: true },
                    { label: "Last Market Analysis", value: "2 minutes ago", positive: null },
                    { label: "Open Positions", value: "2 Active Trades", positive: null },
                    { label: "System Health", value: "Excellent", positive: true },
                  ].map((row, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800/80"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {row.label}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 border ${
                        row.positive === true 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : row.positive === false
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-neutral-800 text-neutral-300 border-neutral-700"
                      }`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>




              {/* ====================================================
                  EXTRA: PERFORMANCE SUMMARY
                 ==================================================== */}
              <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-6">
                  <div className="border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-tighter">
                      Performance Metrics
                    </h2>
                    <Percent className="h-4 w-4 text-neutral-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800">
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Winning Trades</p>
                      <p className="text-base font-bold font-mono text-emerald-400">42 Trades</p>
                    </div>
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800">
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Losing Trades</p>
                      <p className="text-base font-bold font-mono text-rose-400">11 Trades</p>
                    </div>
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800 col-span-2 md:col-span-1">
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Win Rate</p>
                      <p className="text-base font-bold font-mono text-white">79.2%</p>
                    </div>
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800">
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Avg. Win</p>
                      <p className="text-base font-bold font-mono text-emerald-400">+$48.50</p>
                    </div>
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800">
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Avg. Loss</p>
                      <p className="text-base font-bold font-mono text-rose-400">-$22.10</p>
                    </div>
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800 col-span-2 md:col-span-1">
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Global Risk Setting</p>
                      <p className="text-base font-bold font-mono text-white uppercase">Moderate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>




            {/* ====================================================
                SECTION 4: RECENT TRADING ACTIVITY (2 Columns Wide)
               ==================================================== */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-6">
                  <div className="border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-black uppercase tracking-tighter">
                      Recent Trading Activity
                    </h2>
                    <ArrowRightLeft className="h-4 w-4 text-neutral-400" />
                  </div>
                  
                  {/* Table Wrap for Mobile Responsive Horizontal Scroll */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          <th className="pb-3 pr-2">Date</th>
                          <th className="pb-3 px-2">Symbol</th>
                          <th className="pb-3 px-2">Type</th>
                          <th className="pb-3 px-2">Entry</th>
                          <th className="pb-3 px-2">Exit</th>
                          <th className="pb-3 px-2 text-right">Profit/Loss</th>
                          <th className="pb-3 pl-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-xs font-mono font-semibold text-neutral-300">
                        {/* Row 1 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-16</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3365.20</td>
                          <td className="py-3 px-2">3371.60</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$64.20</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-16</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-rose-400 font-black">SELL</td>
                          <td className="py-3 px-2">3372.40</td>
                          <td className="py-3 px-2 text-neutral-500">—</td>
                          <td className="py-3 px-2 text-neutral-400 text-right">—</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 animate-pulse">
                              Running
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-neutral-900/30">
                          <td className="py-3 pr-2 text-neutral-400">2026-07-15</td>
                          <td className="py-3 px-2 font-bold text-white">XAUUSD</td>
                          <td className="py-3 px-2 text-emerald-400 font-black">BUY</td>
                          <td className="py-3 px-2">3358.00</td>
                          <td className="py-3 px-2">3364.70</td>
                          <td className="py-3 px-2 text-emerald-400 text-right font-bold">+$52.80</td>
                          <td className="py-3 pl-2 text-right">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5">
                              Closed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}