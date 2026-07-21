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
  const [userData, setUserData] = useState<{ username: string } | null>(null);
  const [tradeActivities, setTradeActivities] = useState<any[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [subscriptionStats, setSubscriptionStats] = useState<{
    totalAmountSpent: number;
    pendingCount: number;
    activeCount: number;
    rejectedCount: number;
  } | null>(null);

  // Statistics Cards Data
  const statsCards = [
    {
      label: "Total Spent",
      icon: DollarSign,
      iconColor: "text-neutral-400",
      value: subscriptionStats ? `$${subscriptionStats.totalAmountSpent.toFixed(2)}` : "$0.00",
      valueColor: "text-white",
      subtitle: "Approved Plans",
    },
    {
      label: "Pending",
      icon: Clock,
      iconColor: "text-amber-400",
      value: subscriptionStats?.pendingCount.toString() || "0",
      valueColor: "text-amber-400",
      subtitle: "Pending plans",
    },
    {
      label: "Active",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      value: subscriptionStats?.activeCount.toString() || "0",
      valueColor: "text-emerald-400",
      subtitle: "Currently plan",
    },
    {
      label: "Rejected",
      icon: TrendingDown,
      iconColor: "text-rose-400",
      value: subscriptionStats?.rejectedCount.toString() || "0",
      valueColor: "text-rose-400",
      subtitle: "Rejected plans",
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

    // Fetch user data
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData({ username: data.user.username });
        }
      })
      .catch(err => console.error('Failed to fetch user data:', err));

    // Fetch trade activities
    fetch('/api/user/trade-activity')
      .then(res => res.json())
      .then(data => {
        if (data.tradeActivities) {
          setTradeActivities(data.tradeActivities);
        }
      })
      .catch(err => console.error('Failed to fetch trade activities:', err))
      .finally(() => setLoadingTrades(false));

    // Fetch subscription stats
    fetch('/api/user/subscriptions')
      .then(res => res.json())
      .then(data => {
        setSubscriptionStats({
          totalAmountSpent: data.totalAmountSpent,
          pendingCount: data.pendingCount,
          activeCount: data.activeCount,
          rejectedCount: data.rejectedCount
        });
      })
      .catch(err => console.error('Failed to fetch subscription stats:', err));
  }, []);

  return (
    <div className="flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-8">
          
        
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-black pb-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
                {greeting},
              </p>
              <h1 className="text-4xl md:text-3xl font-mono font-black uppercase text-neutral-950 mb-2">
                {userData?.username || 'Loading...'}
              </h1>
            </div>
            <div className="bg-neutral-950 text-white border-2 border-black px-4 py-2 text-right shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                System Time
              </span>
              <span className="text-xs font-mono font-bold">
                {currentTime}
              </span>
            </div>
          </div>  



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

            <div className="lg:col-span-2 space-y-6">
  <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <CardContent className="px-6">
      <div className="border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-tighter">
          Recent Trading Activity
        </h2>
        <ArrowRightLeft className="h-4 w-4 text-neutral-400" />
      </div>
      
      {/* Table Wrap for Mobile Responsive Horizontal Scroll */}
<div className="overflow-x-auto">
  <table className="w-full min-w-[640px] table-fixed text-left border-collapse">
    <thead>
      <tr className="border-b border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400">
        <th className="w-[15%] pb-3 pr-2 whitespace-nowrap">Symbol</th>
        <th className="w-[12%] pb-3 px-2 whitespace-nowrap">Type</th>
        <th className="w-[15%] pb-3 px-2 whitespace-nowrap">Entry</th>
        <th className="w-[15%] pb-3 px-2 whitespace-nowrap">Lot Size</th>
        <th className="w-[13%] pb-3 pl-2 whitespace-nowrap">Date</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-neutral-900 text-xs font-mono font-semibold text-neutral-300">
      {loadingTrades ? (
        <tr>
          <td colSpan={5} className="py-8 text-center text-neutral-400">
            Loading trade activities...
          </td>
        </tr>
      ) : tradeActivities.length === 0 ? (
        <tr>
          <td colSpan={5} className="py-8 text-center text-neutral-400">
            No trade activities found
          </td>
        </tr>
      ) : (
        tradeActivities.map((trade) => {
          const date = new Date(trade.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const typeClass = trade.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400';
          
          return (
            <tr key={trade._id} className="hover:bg-neutral-900/30">
              <td className="py-3 pr-2 font-bold text-white whitespace-nowrap">{trade.symbol}</td>
              <td className={`py-3 px-2 ${typeClass} font-black whitespace-nowrap`}>{trade.type}</td>
              <td className="py-3 px-2 whitespace-nowrap">{trade.entry.toFixed(2)}</td>
              <td className="py-3 px-2 whitespace-nowrap">{trade.lot.toFixed(2)}</td>
              <td className="py-3 pl-2 text-neutral-400 whitespace-nowrap">{date}</td>
            </tr>
          );
        })
      )}
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