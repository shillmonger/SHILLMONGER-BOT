"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Send,
  ShieldCheck,
  Zap,
  Coins,
} from "lucide-react";
import { FaTelegram, FaDiscord, FaTwitter, FaGithub, FaWhatsapp } from "react-icons/fa";
import ScrollToTop from "./ScrollToTop";

const footerLinks = {
  Company: [
    { name: "Exness", href: "https://www.exness.com/" },
    { name: "TradingView", href: "https://www.tradingview.com/" },
    { name: "MetaTrader 5", href: "https://www.metatrader5.com/" },
    { name: "Forex Factory", href: "https://www.forexfactory.com/" },
  ],
  Resources: [
    { name: "Customer Support", href: "/support" },
    { name: "Community Hub", href: "/community" },
    { name: "Developers Portal", href: "/developers" },
    { name: "Guides & Tutorials", href: "/guides" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookies Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  const socialLinks = [
    { name: "Telegram", icon: <FaTelegram size={18} />, href: "#" },
    { name: "Discord", icon: <FaDiscord size={18} />, href: "#" },
    { name: "X (Twitter)", icon: <FaTwitter size={18} />, href: "#" },
    { name: "WhatsApp", icon: <FaWhatsapp size={18} />, href: "#" },
    { name: "GitHub", icon: <FaGithub size={18} />, href: "#" },
  ];

  return (
    <section className="relative mt-10 lg:mt-10 w-full text-neutral-50 font-sans pb-4">
      {/* Footer Outer Container with 10px Margin, Rounded Corners & Blue Theme */}
      <footer className="mx-[10px] lg:mx-[20px] relative bg-indigo-700 border border-indigo-900/50 rounded-4xl overflow-hidden shadow-2xl shadow-indigo-950/40">
        
        {/* Subtle Ambient Blue Top Light */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/10 via-indigo-800/5 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 max-w-[1500px] mx-auto px-6 lg:px-12 pt-16 md:pt-24 lg:pt-16 pb-10">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
            
            {/* Brand details */}
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    SHILLMONGER
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white">
                    Trading Intelligence
                  </p>
                </div>
              </Link>

              <p className="mt-4 text-sm leading-relaxed text-white/80 font-normal">
                Automate your trading with confidence. Choose a subscription plan that matches your account size and let our intelligent trading system execute trades whenever valid market opportunities arise.
              </p>

              {/* Social Icons */}
              <div className="flex gap-2.5 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="w-11 h-11 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40 hover:text-white transition-all duration-300 flex items-center justify-center text-white"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col lg:flex-row justify-between lg:justify-end flex-1 lg:flex-initial lg:ml-auto gap-10 lg:gap-16">
              {Object.entries(footerLinks).map(([title, items]) => (
                <div key={title} className="min-w-[140px]">
                  <h3 className="text-xs uppercase tracking-[0.15em] font-bold text-white mb-5">
                    {title}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm text-white/80 hover:text-white transition-colors duration-200 font-medium"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>


          {/* Trust Badges */}
          <div className="max-w-[1500px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-12">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white uppercase tracking-wide">Secure Trading</h4>
                <p className="text-xs text-white/70 mt-1">Your account credentials are encrypted and never shared.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white uppercase tracking-wide">Real-Time Execution</h4>
                <p className="text-xs text-white/70 mt-1">Lightning-fast trade execution on valid market conditions.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Coins className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white uppercase tracking-wide">MT4/MT5 Compatible</h4>
                <p className="text-xs text-white/70 mt-1">Seamlessly integrates with MetaTrader 4 and 5 platforms.</p>
              </div>
            </div>
          </div>


          {/* Financial Disclaimer */}
          <div className="max-w-[1500px] mx-auto mt-6 space-y-5 text-xs leading-relaxed text-white/70 pt-2">

            {/* Risk Disclosure */}
            <div className="space-y-2 border-t border-white/20 pt-6">
              <p className="text-xs font-normal">
                <span className="font-bold text-white">RISK DISCLOSURE:</span>{" "}
                Trading Forex and other financial markets involves substantial risk and may not be suitable for every investor. Our automated trading bot executes trades based on predefined trading strategies and valid market conditions. While our system is designed to identify quality trading opportunities, profits are never guaranteed, and losses can occur. Users should only trade with funds they can afford to lose.
              </p>
            </div>

            {/* Service Disclaimer */}
            <div className="space-y-2 border-t border-white/20 pt-6">
              <p className="font-bold text-white uppercase tracking-wider text-xs">
                SERVICE DISCLAIMER
              </p>

              <p className="text-xs font-normal">
                SHILLMONGER provides subscription-based access to an automated trading bot that places trades on connected MetaTrader 5 accounts according to each user's selected plan. The bot only executes trades when valid market conditions are detected and does not force trades during unfavorable market conditions. Performance targets described in each subscription plan are objectives rather than guarantees and may vary depending on market volatility and available trading opportunities.
              </p>
            </div>

            {/* User Responsibility */}
            <div className="space-y-2 border-t border-white/20 pt-6">
              <p className="font-bold text-white uppercase tracking-wider text-xs">
                USER RESPONSIBILITY
              </p>

              <p className="text-xs font-normal">
                By subscribing, users acknowledge the risks associated with financial market trading and remain fully responsible for their trading accounts, broker selection, and deposited funds. It is the user's responsibility to ensure their account meets the minimum requirements for their selected subscription plan.
              </p>
            </div>

          </div>

          {/* Final Copyright & Details */}
          <div className="max-w-[1500px] mx-auto border-t border-white/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/70">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <p className="font-semibold text-white">© {new Date().getFullYear()} SHILLMONGER. All rights reserved.</p>
              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-x-4 gap-y-2">
                <Link href="/landing-page/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/landing-page/terms" className="hover:text-white transition-colors">
                  Investor Agreement
                </Link>
                <Link href="/landing-page/refund" className="hover:text-white transition-colors">
                  Refunds Policy
                </Link>
                <Link href="/landing-page/security" className="hover:text-white transition-colors">
                  Security Policy
                </Link>
              </div>
            </div>
            <p className="text-center md:text-right max-w-md text-white/60 text-[11px] leading-relaxed">
              Trading involves risk and profits are never guaranteed. SHILLMONGER provides subscription-based access to an automated trading bot for MetaTrader 5. By using this platform, you acknowledge and accept our Risk Disclosure and Terms of Service.
            </p>
          </div>

        </div>
      </footer>
      <ScrollToTop />
    </section>
  );
}