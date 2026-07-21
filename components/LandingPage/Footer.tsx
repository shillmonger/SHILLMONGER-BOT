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
    { name: "Telegram", icon: <FaTelegram size={20} />, href: "#" },
    { name: "Discord", icon: <FaDiscord size={20} />, href: "#" },
    { name: "X (Twitter)", icon: <FaTwitter size={20} />, href: "#" },
    { name: "WhatsApp", icon: <FaWhatsapp size={20} />, href: "#" },
    { name: "GitHub", icon: <FaGithub size={20} />, href: "#" },
  ];

  return (
    <section className="relative mt-15 lg:mt-40 w-full bg-neutral-950 text-neutral-50 font-sans">
      {/* Floating Character */}
     <div
        className="
          hidden
          sm:block
          absolute
          left-1/2
          -translate-x-1/2
          -top-56
          sm:-top-64
          md:-top-72
          lg:-top-80
          z-30
          pointer-events-none
          select-none
        "
      >
        <Image
          src="/logo.png"
          alt="Footer Character"
          width={900}
          height={900}
          priority
          className="
            w-[500px]
            sm:w-[330px]
            md:w-[420px]
            lg:w-[550px]
            xl:w-[650px]
            h-auto
            grayscale-30
            {/* Added: White drop-shadow */}
            drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]
          "
        />
      </div>

      {/* Footer Container */}
      <footer className="relative bg-neutral-950 border-t-2 border-neutral-800 overflow-visible">
        {/* Content */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-5 lg:px-8 pt-8 md:pt-36 lg:pt-30 pb-8">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row justify-between gap-16">
            
            {/* Brand details */}
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-3">
                <div>
                  <h2 className="text-3xl font-black text-neutral-50 tracking-tighter uppercase">
                    SMG - BOT
                  </h2>
                  <p className="text-[12px] uppercase tracking-[0.25em] font-black text-neutral-400">
                    Trading Intelligence
                  </p>
                </div>
              </Link>

              <p className="mt-4 text-sm md:text-[16px] leading-relaxed text-neutral-400 font-medium">
                Automate your trading with confidence. Choose a subscription plan that matches your account size and let our intelligent trading system execute trades whenever valid market opportunities arise.
              </p>

              {/* Stark Social Icons with preserved theme styling */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-11 h-11 rounded-none border-2 border-neutral-800 bg-neutral-900 hover:bg-neutral-50 hover:text-neutral-950 transition-all duration-300 flex items-center justify-center text-neutral-400 aria-label={social.name}"
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
                  <h3 className="text-[13px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-6">
                    {title}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-[15px] text-neutral-400 hover:text-neutral-50 hover:underline transition-all duration-300 font-medium"
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

          {/* Huge Retro Wordmark */}
          <div className="mt-12 lg:mt-16 overflow-hidden border-t-2 border-neutral-900 py-2">
            <h2
              className="
                text-center
                font-black
                leading-none
                tracking-tighter
                text-neutral-100
                text-[12vw]
                sm:text-[16vw]
                md:text-[13vw]
                lg:text-[10vw]
                select-none
              "
            >
              SHILLMONGER
            </h2>
          </div>

          {/* Financial Disclaimer */}
<div className="max-w-[1400px] mx-auto mt-5 space-y-6 text-xs leading-relaxed text-neutral-400 pt-2">

  {/* Risk Disclosure */}
  <div className="space-y-2 border-t border-dashed border-neutral-800 pt-6">
    <p className="text-sm font-medium">
      <span className="font-black text-neutral-50">RISK DISCLOSURE:</span>{" "}
      Trading Forex and other financial markets involves substantial risk and may not be suitable for every investor. Our automated trading bot executes trades based on predefined trading strategies and valid market conditions. While our system is designed to identify quality trading opportunities, profits are never guaranteed, and losses can occur. Users should only trade with funds they can afford to lose.
    </p>
  </div>

  {/* Service Disclaimer */}
  <div className="space-y-2 border-t border-dashed border-neutral-800 pt-6">
    <p className="font-black text-neutral-50 uppercase tracking-widest text-sm">
      SERVICE DISCLAIMER
    </p>

    <p className="text-sm font-medium">
      SHILLMONGER provides subscription-based access to an automated trading bot that places trades on connected MetaTrader 5 accounts according to each user's selected plan. The bot only executes trades when valid market conditions are detected and does not force trades during unfavorable market conditions. Performance targets described in each subscription plan are objectives rather than guarantees and may vary depending on market volatility and available trading opportunities.
    </p>
  </div>

  {/* User Responsibility */}
  <div className="space-y-2 border-t border-dashed border-neutral-800 pt-6">
    <p className="font-black text-neutral-50 uppercase tracking-widest text-sm">
      USER RESPONSIBILITY
    </p>

    <p className="text-sm font-medium">
      By subscribing, users acknowledge the risks associated with financial market trading and remain fully responsible for their trading accounts, broker selection, and deposited funds. It is the user's responsibility to ensure their account meets the minimum requirements for their selected subscription plan.
    </p>
  </div>

</div>

          {/* Final Copyright & Details */}
          <div className="max-w-[1400px] mx-auto border-t-2 border-neutral-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-400">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <p className="font-bold text-neutral-50">© {new Date().getFullYear()} SHILLMONGER. All rights reserved.</p>
              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-x-4 gap-y-2">
                <Link href="/landing-page/privacy" className="underline hover:text-neutral-50 font-medium">
                  Privacy Policy
                </Link>
                <Link href="/landing-page/terms" className="underline hover:text-neutral-50 font-medium">
                  Investor Agreement
                </Link>
                <Link href="/landing-page/refund" className="underline hover:text-neutral-50 font-medium">
                  Refunds Policy
                </Link>
                <Link href="/landing-page/security" className="underline hover:text-neutral-50 font-medium">
                  Security Policy
                </Link>
              </div>
            </div>
            <p className="italic text-center md:text-right max-w-md opacity-80 text-[11px] font-medium">
  Trading involves risk and profits are never guaranteed. SHILLMONGER provides subscription-based access to an automated trading bot for MetaTrader 5. By using this platform, you acknowledge and accept our Risk Disclosure and Terms of Service.
</p>
          </div>

        </div>
      </footer>
            <ScrollToTop />
      
    </section>
  );
}