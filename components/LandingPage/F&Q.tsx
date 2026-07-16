"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "What is SMG BOT and how does it work?",
    answer: "SMG BOT is an automated XAUUSD trading bot that integrates with your MetaTrader 4 or 5 account. Once connected, our advanced algorithms analyze market conditions and execute trades on your behalf, allowing you to participate in gold trading without manual intervention."
  },
  {
    question: "How do I connect my MT4/MT5 account to the bot?",
    answer: "After purchasing a subscription, you'll receive connection instructions. Simply enter your broker account credentials in our secure dashboard, and our system will link your MT4/MT5 account for automated trading execution."
  },
  {
    question: "Can I test the bot on a demo account first?",
    answer: "Absolutely! We strongly recommend testing SHILLMONGER on a demo account first to verify performance and familiarize yourself with the system before connecting a live account with real capital."
  },
  {
    question: "How do subscription plans work?",
    answer: "We offer flexible subscription plans to match different account sizes and trading goals. Each plan provides automated trading for a specified duration (typically 5 days to 1 Months). At the end of your subscription, you can renew or upgrade to continue using the bot."
  },
  {
    question: "How and when can I withdraw my profits?",
    answer: "Profits are calculated and credited to your account according to your subscription plan terms. You can withdraw your profits at any time through your broker account using your preferred payment method."
  },
  {
    question: "Is my broker account information secure?",
    answer: "Yes, security is our top priority. Your broker credentials are encrypted and never shared with third parties. We use industry-standard encryption to protect your account information at all times."
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const half = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, half);
  const rightColumnFaqs = faqs.slice(half);

  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-4 lg:px-8 w-full text-black font-sans">
      <div className="text-center mb-5 relative z-10">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 leading-none text-black">
          Asked Questions
        </h2>

        {/* Centered Paragraph */}
        <p className="text-neutral-600 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Everything you need to know about the SHILLMONGER automated trading bot.
          From MT4/MT5 integration to subscription plans and withdrawals.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-5">
          {leftColumnFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {rightColumnFaqs.map((faq, index) => {
            const globalIndex = index + half;
            return (
              <FAQItem
                key={globalIndex}
                faq={faq}
                isOpen={openIndex === globalIndex}
                onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, onClick }: { faq: any; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`group relative transition-all duration-300 rounded-none border-2 border-black cursor-pointer overflow-hidden ${
        isOpen
          ? "bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          : "bg-white hover:bg-neutral-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      }`}
    >
      <div className="w-full flex items-center justify-between p-5 text-left">
        <span
          className="text-xs md:text-[13px] font-black uppercase tracking-wider text-black"
        >
          {faq.question}
        </span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-none border-2 border-black bg-black text-white">
              <X className="w-4 h-4 stroke-[3px]" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-none border-2 border-black bg-white text-black transition-all duration-300 group-hover:bg-black group-hover:text-white">
              <Plus className="w-4 h-4 stroke-[3px]" />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-5" onClick={(e) => e.stopPropagation()}>
          <div className="h-[2px] bg-black mb-4" />
          <p className="text-neutral-600 text-xs md:text-sm leading-relaxed font-medium">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}