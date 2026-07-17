"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, Trophy, ChevronRight, Users, Wallet, DollarSign, BriefcaseBusiness } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ─── Rank Badge Images ────────────────────────────────────────────────────────

const RANK_IMAGES: Record<number, string> = {
  1: "https://i.postimg.cc/SKV9yRnv/Leaderboard-1.png",
  2: "https://i.postimg.cc/zGF7gJLd/Leaderboard-2.png",
  3: "https://i.postimg.cc/jdV43WPn/Leaderboard-3.png",
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface LeaderboardUser {
  rank: number;
  username: string;
  email: string;
  balance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  totalProfits: number;
  profileImage: string;
  fullName: string;
}

interface TopThreeUser {
  rank: number;
  username: string;
  avatar: string;
  metric: number;
  metricName: string;
}

// ─── Local Mock Data (Replaces API backend fetches) ──────────────────────────

const TOP_THREE_DATA: TopThreeUser[] = [
  { rank: 1, username: "Alpha_Trader", avatar: "https://github.com/shadcn.png", metric: 125430.50, metricName: "Total Withdrawals" },
  { rank: 2, username: "BullMarket9", avatar: "https://github.com/shadcn.png", metric: 98120.00, metricName: "Total Withdrawals" },
  { rank: 3, username: "WhaleWatcher", avatar: "https://github.com/shadcn.png", metric: 84350.25, metricName: "Total Withdrawals" },
];

const LEADERBOARD_TABLE_DATA: LeaderboardUser[] = [
  { rank: 1, username: "Alpha_Trader", email: "alpha.trader@example.com", balance: 450000.00, totalDeposit: 500000.00, totalWithdrawal: 125430.50, totalProfits: 75430.50, profileImage: "https://github.com/shadcn.png", fullName: "Alpha Trader" },
  { rank: 2, username: "BullMarket9", email: "bull9@example.com", balance: 310200.00, totalDeposit: 350000.00, totalWithdrawal: 98120.00, totalProfits: 58120.00, profileImage: "https://github.com/shadcn.png", fullName: "Bull Market" },
  { rank: 3, username: "WhaleWatcher", email: "whale@example.com", balance: 289400.00, totalDeposit: 300000.00, totalWithdrawal: 84350.25, totalProfits: 73750.25, profileImage: "https://github.com/shadcn.png", fullName: "Whale Watcher" },
  { rank: 4, username: "RiskTaker", email: "risktaker@example.com", balance: 198300.00, totalDeposit: 220000.00, totalWithdrawal: 45100.00, totalProfits: 23400.00, profileImage: "https://github.com/shadcn.png", fullName: "Risk Taker" },
  { rank: 5, username: "HedgeMaster", email: "hedge@example.com", balance: 175000.00, totalDeposit: 180000.00, totalWithdrawal: 39200.00, totalProfits: 34200.00, profileImage: "https://github.com/shadcn.png", fullName: "Hedge Master" },
  { rank: 6, username: "CryptoKing", email: "cryptoking@example.com", balance: 154000.00, totalDeposit: 160000.00, totalWithdrawal: 31200.00, totalProfits: 25200.00, profileImage: "https://github.com/shadcn.png", fullName: "Crypto King" },
  { rank: 7, username: "BearSlayer", email: "bear@example.com", balance: 142000.00, totalDeposit: 150000.00, totalWithdrawal: 28400.00, totalProfits: 20400.00, profileImage: "https://github.com/shadcn.png", fullName: "Bear Slayer" },
  { rank: 8, username: "OptionGuru", email: "option@example.com", balance: 121000.00, totalDeposit: 130000.00, totalWithdrawal: 21900.00, totalProfits: 12900.00, profileImage: "https://github.com/shadcn.png", fullName: "Option Guru" },
  { rank: 9, username: "ScalperX", email: "scalper@example.com", balance: 110500.00, totalDeposit: 115000.00, totalWithdrawal: 19400.00, totalProfits: 14900.00, profileImage: "https://github.com/shadcn.png", fullName: "Scalper X" },
  { rank: 10, username: "DayTradePro", email: "daytrade@example.com", balance: 98000.00, totalDeposit: 100000.00, totalWithdrawal: 14500.00, totalProfits: 12500.00, profileImage: "https://github.com/shadcn.png", fullName: "Day Trade Pro" },
];

const TABLE_HEADERS = ["Rank", "Traders", "Withdrawals", "Profits"];

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// ─── Podium Card Configuration ───────────────────────────────────────────────

const RANK_CONFIG = {
  1: {
    border: "border-2 border-yellow-500",
    gradient: "bg-neutral-950",
    innerBg: "bg-yellow-500/10 border-2 border-yellow-500",
    avatarBorder: "border-2 border-yellow-500",
    nameColor: "text-yellow-400 text-xl",
    scoreColor: "text-yellow-400 text-4xl",
    podiumOffset: "-translate-y-4",
    scale: "flex-[1.15] w-44",
    badgeSize: "w-12 h-12",
    avatarSize: "w-20 h-20",
    shimmer: true,
    topAccent: "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-yellow-500",
  },
  2: {
    border: "border-2 border-slate-400",
    gradient: "bg-neutral-950",
    innerBg: "bg-slate-500/10 border-2 border-slate-400",
    avatarBorder: "border-2 border-slate-400",
    nameColor: "text-slate-300 text-lg",
    scoreColor: "text-slate-200 text-3xl",
    podiumOffset: "translate-y-0",
    scale: "flex-1 w-40",
    badgeSize: "w-10 h-10",
    avatarSize: "w-18 h-18",
    shimmer: false,
    topAccent: "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-slate-400",
  },
  3: {
    border: "border-2 border-amber-700",
    gradient: "bg-neutral-950",
    innerBg: "bg-amber-700/10 border-2 border-amber-700",
    avatarBorder: "border-2 border-amber-700",
    nameColor: "text-amber-400 text-lg",
    scoreColor: "text-amber-300 text-3xl",
    podiumOffset: "translate-y-0",
    scale: "flex-1 w-40",
    badgeSize: "w-10 h-10",
    avatarSize: "w-18 h-18",
    shimmer: false,
    topAccent: "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-amber-700",
  },
} as const;

function PodiumCard({ player }: { player: TopThreeUser }) {
  const cfg = RANK_CONFIG[player.rank as 1 | 2 | 3];
  const isFirst = player.rank === 1;

  return (
    <div
      className={[
        "relative flex flex-col cursor-pointer items-center text-center p-3 border-2 transition-all duration-500",
        "rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        cfg.scale,
        cfg.podiumOffset,
        cfg.border,
        cfg.gradient,
        "hover:-translate-y-1 hover:scale-[1.01]",
        "before:content-['']",
        cfg.topAccent,
      ].join(" ")}
    >
      {/* ── Rank badge ── */}
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 -top-5 z-10",
          isFirst ? "animate-bounce [animation-duration:3s]" : "",
        ].join(" ")}
      >
        <img
          src={RANK_IMAGES[player.rank]}
          alt={`Rank ${player.rank}`}
          className={["object-contain", cfg.badgeSize].join(" ")}
        />
      </div>

      {/* ── Avatar ── */}
      <Avatar
        className={[
          "rounded-none border-2 p-1 mt-8",
          cfg.avatarSize,
          cfg.avatarBorder,
        ].join(" ")}
      >
        <AvatarImage
          src={player.avatar}
          alt={player.username}
          className="rounded-none object-contain"
        />
        <AvatarFallback className="text-2xl font-black rounded-none">
          {player.rank}
        </AvatarFallback>
      </Avatar>

      {/* ── Username ── */}
      <p
        className={[
          "font-black uppercase tracking-wider mt-2 mb-3 px-1",
          "text-foreground",
          cfg.nameColor,
        ].join(" ")}
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
      >
        {player.username}
      </p>

      {/* ── Score panel ── */}
      <div
        className={[
          "w-full rounded-none flex flex-col items-center py-2.5 px-4 border mt-auto relative overflow-hidden",
          cfg.innerBg,
        ].join(" ")}
      >
        {isFirst && cfg.shimmer && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(234,179,8,0.06) 50%, transparent 60%)",
              animation: "shimmer 4s ease-in-out infinite",
            }}
          />
        )}

        <p
          className={[
            "font-black tracking-tight text-white relative z-10",
            cfg.scoreColor,
          ].join(" ")}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {fmt(player.metric)}
        </p>

        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mt-1 pt-1 border-t border-neutral-700 w-full text-center relative z-10">
          {player.metricName}
        </p>
      </div>

      {isFirst && cfg.shimmer && (
        <style>{`
          @keyframes shimmer {
            0%   { transform: translateX(-100%); }
            50%  { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      )}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [slideIdx, setSlideIdx] = useState(1);
  const [search, setSearch] = useState("");

  const topThree = TOP_THREE_DATA;
  const leaderboardData = LEADERBOARD_TABLE_DATA;

  const nextSlide = () => setSlideIdx((prev) => (prev + 1) % topThree.length);
  const prevSlide = () => setSlideIdx((prev) => (prev - 1 + topThree.length) % topThree.length);
  const jumpTo = (i: number) => setSlideIdx(i);

  const filtered = useMemo(
    () =>
      leaderboardData.filter(
        (r) =>
          r.username.toLowerCase().includes(search.toLowerCase())
      ),
    [search, leaderboardData]
  );

  const PODIUM_ORDER = [topThree[1], topThree[0], topThree[2]];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      {/* Main dashboard responsive inner grid container layout */}
      <main className="w-full max-w-7xl mx-auto space-y-6 text-neutral-950 font-sans">
        
        {/* ── Page Header ── */}
        <section className="w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-black pb-3 mb-6">
            <div>
              <h1 className="text-4xl md:text-3xl font-mono font-black uppercase text-neutral-950 mb-2">
                Leaderboard
              </h1>
              <p className="text-sm text-neutral-600 font-semibold max-w-xl leading-relaxed">
                Compare performance & portfolio metrics against the most successful users
              </p>
            </div>
          </div>

          {/* ── Built-in Search Bar ── */}
          <div className="max-w-xs mx-auto pt-2">
            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black bg-neutral-900/60 text-white focus:outline-none focus:ring-2 ring-neutral-700 rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
        </section>

        {/* ── Mobile Top 3 Slider (2nd-1st-3rd Order) ── */}
        <section className="relative lg:hidden pb-6 overflow-hidden">
          <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground/30 text-center mb-5">
            Top Players This Season
          </p>

          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
              style={{
                transform: `translateX(calc(-${slideIdx * 80}% + 10%))`,
              }}
            >
              {[topThree[1], topThree[0], topThree[2]].map((player, i) => {
                const isActive = i === slideIdx;
                const isFirst = player.rank === 1;

                const rankStyle = {
                  1: {
                    card: "border-2 border-yellow-500 bg-neutral-950",
                    topLine: "bg-yellow-500",
                    avatarBorder: "border-2 border-yellow-500",
                    badgeGlow: "",
                    username: "text-yellow-400",
                    panel: "bg-yellow-500/10 border-2 border-yellow-500",
                    score: "text-yellow-400",
                  },
                  2: {
                    card: "border-2 border-slate-400 bg-neutral-950",
                    topLine: "bg-slate-400",
                    avatarBorder: "border-2 border-slate-400",
                    badgeGlow: "",
                    username: "text-slate-300",
                    panel: "bg-slate-500/10 border-2 border-slate-400",
                    score: "text-slate-200",
                  },
                  3: {
                    card: "border-2 border-amber-700 bg-neutral-950",
                    topLine: "bg-amber-700",
                    avatarBorder: "border-2 border-amber-700",
                    badgeGlow: "",
                    username: "text-amber-400",
                    panel: "bg-amber-700/10 border-2 border-amber-700",
                    score: "text-amber-300",
                  },
                }[player.rank as 1 | 2 | 3];

                return (
                  <div
                    key={player.rank}
                    className="flex-[0_0_80%] px-1 transition-all duration-350"
                    style={{
                      opacity: isActive ? 1 : 0.45,
                      transform: isActive ? "scale(1)" : "scale(0.93)",
                    }}
                  >
                    <div
                      className={[
                        "relative rounded-none border-2 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                        rankStyle.card,
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "absolute inset-x-0 top-0 h-[1.5px] rounded-none",
                          rankStyle.topLine,
                        ].join(" ")}
                      />

                      <div className="flex flex-col items-center gap-0 px-5 pt-7 pb-6 text-center relative z-10">
                        <img
                          src={RANK_IMAGES[player.rank]}
                          alt={`Rank ${player.rank}`}
                          className={[
                            "object-contain mb-3",
                            isFirst ? "w-14 h-14" : "w-11 h-11",
                            rankStyle.badgeGlow,
                            isFirst ? "animate-[float_3s_ease-in-out_infinite]" : "",
                          ].join(" ")}
                        />

                        <Avatar
                          className={[
                            "rounded-none border-2 p-0.5 mb-4",
                            "w-16 h-16",
                            rankStyle.avatarBorder,
                          ].join(" ")}
                        >
                          <AvatarImage
                            src={player.avatar}
                            alt={player.username}
                            className="rounded-none object-cover"
                          />
                          <AvatarFallback
                            className="rounded-none text-xl font-black"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                          >
                            {player.rank}
                          </AvatarFallback>
                        </Avatar>

                        <p
                          className={["font-black uppercase tracking-[0.1em] mb-4", rankStyle.username].join(" ")}
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "1.1rem",
                          }}
                        >
                          {player.username}
                        </p>

                        <div
                          className={[
                            "w-full rounded-none border flex flex-col items-center py-3.5 px-5 gap-1.5",
                            rankStyle.panel,
                          ].join(" ")}
                        >
                          <p
                            className={["font-black leading-none", rankStyle.score].join(" ")}
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: "2rem",
                            }}
                          >
                            {fmt(player.metric)}
                          </p>
                          <p className="text-[8px] font-black uppercase tracking-[0.22em] text-neutral-400 pt-1.5 border-t border-neutral-700 w-full text-center">
                            {player.metricName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5 px-5">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="w-9 h-9 rounded-none border-2 border-black bg-neutral-900 hover:bg-neutral-800 active:scale-90 transition-all duration-150 flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {[topThree[1], topThree[0], topThree[2]].map((player, i) => {
                const isActive = i === slideIdx;
                const dotColor = {
                  1: isActive ? "bg-yellow-400/85" : "bg-muted-foreground/25",
                  2: isActive ? "bg-slate-400/75" : "bg-muted-foreground/25",
                  3: isActive ? "bg-amber-500/80" : "bg-muted-foreground/25",
                }[player.rank as 1 | 2 | 3];

                return (
                  <button
                    key={i}
                    onClick={() => jumpTo(i)}
                    aria-label={`Go to rank ${player.rank}`}
                    className={[
                      "h-[5px] rounded-none transition-all duration-300",
                      isActive ? "w-5" : "w-[5px]",
                      dotColor,
                    ].join(" ")}
                  />
                );
              })}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next"
              className="w-9 h-9 rounded-none border-2 border-black bg-neutral-900 hover:bg-neutral-800 active:scale-90 transition-all duration-150 flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-3px); }
            }
          `}</style>
        </section>

        {/* ── Desktop Podium: 2 – 1 – 3 ── */}
        <section className="hidden lg:flex items-end mx-auto justify-center gap-5 pt-4 pb-4">
          {PODIUM_ORDER.map((player: TopThreeUser) => (
            <PodiumCard key={player.rank} player={player} />
          ))}
        </section>

        {/* ── Leaderboard Table ── */}
        <section className="bg-neutral-950 text-white border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="flex items-center justify-between gap-2 p-3 md:p-4 md:gap-4 border-b border-neutral-800 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-800 border border-neutral-700 rounded-none">
                <Users className="w-5 h-5 text-neutral-300" />
              </div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                Top 10 Traders — Realtime Stats
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-black uppercase tracking-tight">
              <thead>
                <tr className="border-b border-neutral-800">
                  {TABLE_HEADERS.map((h, i) => (
                    <th
                      key={h}
                      className={[
                        "px-6 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 whitespace-nowrap",
                        i === 0 ? "text-left" : "text-right",
                      ].join(" ")}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y cursor-pointer divide-neutral-800">
                {filtered.map((row: LeaderboardUser) => (
                  <tr
                    key={row.rank}
                    className={[
                      "group transition-colors hover:bg-neutral-800/50",
                      row.rank === 1 ? "bg-yellow-500/[0.04]" : "",
                      row.rank === 2 ? "bg-slate-400/[0.03]" : "",
                      row.rank === 3 ? "bg-orange-700/[0.03]" : "",
                    ].join(" ")}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {row.rank <= 3 && (
                          <img src={RANK_IMAGES[row.rank]} alt={`Rank ${row.rank}`} className="w-10 h-10 object-contain drop-shadow" />
                        )}
                        <span
                          className={[
                            "font-black text-xl leading-none",
                            row.rank === 1 ? "text-yellow-400" : row.rank === 2 ? "text-slate-400" : row.rank === 3 ? "text-orange-600" : "text-neutral-400",
                          ].join(" ")}
                          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                          {row.rank}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 rounded-none border border-neutral-700 p-0.5 flex-shrink-0">
                          <AvatarImage src={row.profileImage} className="rounded-none" />
                          <AvatarFallback className="text-xs rounded-none">{row.rank}</AvatarFallback>
                        </Avatar>
                        <span
                          className="font-black text-sm text-white group-hover:text-neutral-300 transition-colors"
                          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
                        >
                          {row.username}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-500 opacity-50" />
                        <span className="text-sm text-amber-500" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{fmt(row.totalWithdrawal)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-blue-500 opacity-50" />
                        <span className="text-sm text-blue-400" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{fmt(row.totalProfits)}</span>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-neutral-400 text-xs tracking-widest uppercase">
                      No players found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </>
  );
}