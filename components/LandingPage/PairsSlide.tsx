"use client";

import { useEffect, useRef, useState } from "react";

// ─── TICKER DATA ──────────────────────────────────────────────────────────────
const TICKERS_INIT = [
  { symbol: "SPX", label: "S&P 500", price: 5312.0, change: 12.3, pct: 0.17, tvSymbol: "SP:SPX", iconBg: "#1a56db", iconText: "S" },
  { symbol: "US100", label: "US 100", price: 28172.8, change: 87.00, pct: 0.31, tvSymbol: "NASDAQ:NDX", iconBg: "#1a56db", iconText: "100" },
  { symbol: "BTCUSD", label: "Bitcoin", price: 81263, change: 350, pct: 0.43, tvSymbol: "BITSTAMP:BTCUSD", iconBg: "#f7931a", iconText: "₿" },
  { symbol: "ETHUSD", label: "Ethereum", price: 2368.4, change: 7.1, pct: 0.30, tvSymbol: "BITSTAMP:ETHUSD", iconBg: "#627eea", iconText: "Ξ" },
  { symbol: "SOLUSD", label: "Solana", price: 214.15, change: 12.4, pct: 5.82, tvSymbol: "BINANCE:SOLUSD", iconBg: "#00FFA3", iconText: "S" },
  { symbol: "NVDA", label: "NVIDIA", price: 145.28, change: 3.45, pct: 2.43, tvSymbol: "NASDAQ:NVDA", iconBg: "#76b900", iconText: "N" },
  { symbol: "TSLA", label: "TSLA", price: 389.37, change: -3.14, pct: -0.8, tvSymbol: "NASDAQ:TSLA", iconBg: "#cc0000", iconText: "T" },
  { symbol: "XAUUSD", label: "Gold", price: 4632.0, change: 8.5, pct: 0.18, tvSymbol: "TVC:GOLD", iconBg: "#d4a017", iconText: "Au" },
  { symbol: "XAGUSD", label: "Silver", price: 31.42, change: 0.45, pct: 1.45, tvSymbol: "TVC:SILVER", iconBg: "#A6A9AA", iconText: "Ag" },
  { symbol: "AAPL", label: "Apple", price: 213.49, change: 1.82, pct: 0.86, tvSymbol: "NASDAQ:AAPL", iconBg: "#555555", iconText: "A" },
  { symbol: "AMZN", label: "Amazon", price: 189.12, change: -1.24, pct: -0.65, tvSymbol: "NASDAQ:AMZN", iconBg: "#ff9900", iconText: "A" },
  { symbol: "GOOGL", label: "Google", price: 172.45, change: 2.15, pct: 1.26, tvSymbol: "NASDAQ:GOOGL", iconBg: "#4285F4", iconText: "G" },
  { symbol: "EURUSD", label: "EUR/USD", price: 1.0842, change: -0.0012, pct: -0.11, tvSymbol: "FX:EURUSD", iconBg: "#003399", iconText: "€" },
  { symbol: "GBPUSD", label: "GBP/USD", price: 1.2715, change: 0.0023, pct: 0.18, tvSymbol: "FX:GBPUSD", iconBg: "#012169", iconText: "£" },
  { symbol: "USDJPY", label: "USD/JPY", price: 156.42, change: 0.85, pct: 0.54, tvSymbol: "FX:USDJPY", iconBg: "#bc002d", iconText: "¥" },
  { symbol: "CRUDE", label: "Crude Oil", price: 78.34, change: -0.61, pct: -0.77, tvSymbol: "NYMEX:CL1!", iconBg: "#333333", iconText: "🛢" },
];

// ─── TICKER ITEM ──────────────────────────────────────────────────────────────
function TickerItem({ item }: { item: any }) {
  const [currentPrice, setCurrentPrice] = useState(item.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const href = `https://www.tradingview.com/symbols/${item.tvSymbol}/`;

  useEffect(() => {
    const interval = setInterval(() => {
      const movement = (Math.random() - 0.5) * (item.price * 0.001);
      const newPrice = currentPrice + movement;
      
      setFlash(movement > 0 ? "up" : "down");
      setCurrentPrice(newPrice);

      const timeout = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timeout);
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(interval);
  }, [currentPrice, item.price]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-4 px-8 group cursor-pointer select-none whitespace-nowrap shrink-0 border-r-2 border-neutral-800 hover:bg-neutral-900/40 transition-colors duration-300"
      title={`View ${item.label} on TradingView`}
    >
      {/* Sharp Brutalist Ticker Icon */}
      <span
        className="inline-flex items-center justify-center h-6 w-6 rounded-none text-white font-black text-[11px] shrink-0 border border-neutral-800"
        style={{ background: item.iconBg }}
      >
        {item.iconText}
      </span>

      <span className="text-neutral-50 text-sm font-black uppercase tracking-tight">
        {item.label}
      </span>

      <span 
        className={`text-sm font-mono font-black transition-all duration-300 ${
          flash === "up" ? "text-emerald-400 scale-105" : 
          flash === "down" ? "text-red-400 scale-105" : 
          "text-neutral-50"
        }`}
      >
        {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>

      <span
        className={`text-xs font-black ${
          item.change >= 0 ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)} ({item.pct}%)
      </span>

      {/* Tiny TradingView Indicator Icon */}
      <div className="relative w-5 h-5 mr-1 overflow-hidden rounded-none border border-neutral-800">
        <img 
          src="https://i.postimg.cc/0rg4wPYg/trading-view.jpg" 
          alt="TradingView" 
          className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
    </a>
  );
}

// ─── TICKER BAR ───────────────────────────────────────────────────────────────
export default function TickerBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const speed = 2.5;

  useEffect(() => {
    const step = () => {
      posRef.current -= speed;
      if (trackRef.current) {
        const itemWidth = trackRef.current.scrollWidth / 4; // Since we have 4 sets of tickers
        if (Math.abs(posRef.current) >= itemWidth) {
          posRef.current = 0;
        }
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      requestAnimationFrame(step);
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 border-y-2 border-neutral-800 my-5 flex items-center h-12">
      {/* TradingView Branding (Fixed Left) */}
      <a 
        href="https://www.tradingview.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute left-0 top-0 h-full z-30 flex items-center px-2 lg:px-2 bg-neutral-950/95 backdrop-blur-sm border-r-2 border-neutral-800 shadow-[10px_0_15px_rgba(0,0,0,0.4)] hover:bg-neutral-900 transition-all duration-300 group"
      >
        <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-none border border-neutral-800">
          <img 
            src="https://i.postimg.cc/0rg4wPYg/trading-view.jpg" 
            alt="TradingView" 
            className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
        
        <span className="text-xs font-black uppercase tracking-[0.15em] text-neutral-50 hidden md:block">
          Market Live
        </span>
      </a>

      {/* Scrolling Track */}
      <div className="flex items-center whitespace-nowrap h-full overflow-hidden w-full pl-20 md:pl-48">
        <div ref={trackRef} className="flex items-center will-change-transform py-3">
          {[...TICKERS_INIT, ...TICKERS_INIT, ...TICKERS_INIT, ...TICKERS_INIT].map((item, i) => (
            <TickerItem key={`${item.symbol}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Right Fade in Theme colors */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-20 bg-gradient-to-l from-neutral-950 to-transparent" />
    </div>
  );
}