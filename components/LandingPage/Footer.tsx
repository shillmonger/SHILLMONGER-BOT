"use client";

import Image from "next/image";
import Link from "next/link";
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
    <section className="relative mt-10 lg:mt-20 w-full bg-neutral-950 text-neutral-50 font-sans">
      
      {/* Floating Logo Character Overlay */}
      

      {/* Footer Container */}
      <footer className="relative bg-neutral-950 border-t border-neutral-800/80 overflow-visible">
        {/* Content */}
        <div className="relative z-20 max-w-[1500px] mx-auto px-6 lg:px-12 pt-16 md:pt-36 lg:pt-15 pb-10">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
            
            {/* Brand details */}
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    SHILLMONGER
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                    Trading Intelligence
                  </p>
                </div>
              </Link>

              <p className="mt-4 text-sm leading-relaxed text-neutral-400 font-normal">
                Automate your trading with confidence. Choose a subscription plan that matches your account size and let our intelligent trading system execute trades whenever valid market opportunities arise.
              </p>

              {/* Social Icons */}
              <div className="flex gap-2.5 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="w-10 h-10 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all duration-300 flex items-center justify-center text-neutral-400 hover:shadow-lg hover:shadow-indigo-500/20"
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
                          className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 font-medium"
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


          {/* Financial Disclaimer */}
          <div className="max-w-[1500px] mx-auto mt-6 space-y-5 text-xs leading-relaxed text-neutral-400 pt-2">

            {/* Risk Disclosure */}
            <div className="space-y-2 border-t border-neutral-800/60 pt-6">
              <p className="text-xs font-normal">
                <span className="font-bold text-neutral-200">RISK DISCLOSURE:</span>{" "}
                Trading Forex and other financial markets involves substantial risk and may not be suitable for every investor. Our automated trading bot executes trades based on predefined trading strategies and valid market conditions. While our system is designed to identify quality trading opportunities, profits are never guaranteed, and losses can occur. Users should only trade with funds they can afford to lose.
              </p>
            </div>

            {/* Service Disclaimer */}
            <div className="space-y-2 border-t border-neutral-800/60 pt-6">
              <p className="font-bold text-neutral-200 uppercase tracking-wider text-xs">
                SERVICE DISCLAIMER
              </p>

              <p className="text-xs font-normal">
                SHILLMONGER provides subscription-based access to an automated trading bot that places trades on connected MetaTrader 5 accounts according to each user's selected plan. The bot only executes trades when valid market conditions are detected and does not force trades during unfavorable market conditions. Performance targets described in each subscription plan are objectives rather than guarantees and may vary depending on market volatility and available trading opportunities.
              </p>
            </div>

            {/* User Responsibility */}
            <div className="space-y-2 border-t border-neutral-800/60 pt-6">
              <p className="font-bold text-neutral-200 uppercase tracking-wider text-xs">
                USER RESPONSIBILITY
              </p>

              <p className="text-xs font-normal">
                By subscribing, users acknowledge the risks associated with financial market trading and remain fully responsible for their trading accounts, broker selection, and deposited funds. It is the user's responsibility to ensure their account meets the minimum requirements for their selected subscription plan.
              </p>
            </div>

          </div>

          {/* Final Copyright & Details */}
          <div className="max-w-[1500px]  mx-auto border-t border-neutral-900 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-400">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <p className="font-semibold text-neutral-300">© {new Date().getFullYear()} SHILLMONGER. All rights reserved.</p>
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
            <p className="text-center md:text-right max-w-md text-neutral-400 text-[11px] leading-relaxed">
              Trading involves risk and profits are never guaranteed. SHILLMONGER provides subscription-based access to an automated trading bot for MetaTrader 5. By using this platform, you acknowledge and accept our Risk Disclosure and Terms of Service.
            </p>
          </div>

        </div>
      </footer>
      <ScrollToTop />
    </section>
  );
}