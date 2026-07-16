"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SlideItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const initialItems: SlideItem[] = [
  {
    id: 1,
    title: '"Automated XAUUSD Trading"',
    description:
      "Experience the power of our intelligent trading bot that executes trades 24/7. Connect your MT4/MT5 account and let our algorithms maximize your gold trading potential.",
    image: "https://cdn.mos.cms.futurecdn.net/dP3N4qnEZ4tCTCLq59iysd.jpg",
  },
  {
    id: 2,
    title: '"Seamless MT4/MT5 Integration"',
    description:
      "Connect your MetaTrader account in minutes. Our secure integration ensures your trades are executed instantly with minimal latency for optimal performance.",
    image: "https://i.redd.it/tc0aqpv92pn21.jpg",
  },
  {
    id: 3,
    title: '"Flexible Subscription Plans"',
    description:
      "Choose from plans ranging from 5 days to 1 month. Whether you're a beginner or experienced trader, we have options to match your account size and goals.",
    image: "https://wharferj.files.wordpress.com/2015/11/bio_north.jpg",
  },
  {
    id: 4,
    title: '"Test on Demo First"',
    description:
      "Verify our bot's performance risk-free. Test on demo accounts before committing real capital to ensure confidence in our trading strategies.",
    image: "https://images7.alphacoders.com/878/878663.jpg",
  },
  {
    id: 5,
    title: '"Secure & Reliable"',
    description:
      "Your broker credentials are encrypted and never shared. Our platform uses industry-standard security to protect your account and trading data.",
    image: "https://da.se/app/uploads/2015/09/simon-december1994.jpg",
  },
  {
    id: 6,
    title: '"Withdraw Anytime"',
    description:
      "Access your profits whenever you want. Withdraw directly to your broker account or preferred payment method with no hidden fees or restrictions.",
    image: "https://i.redd.it/tc0aqpv92pn21.jpg",
  },
];

// index 0 & 1 = full-bleed background layers (crossfade)
// index 2, 3, 4 = the three visible sliding preview thumbnails
// index 5 = queued off-screen, invisible until it slides in
const positionClasses = [
  "left-0 top-0 w-full h-full rounded-none shadow-none opacity-100 border border-black",
  "left-0 top-0 w-full h-full rounded-none shadow-none opacity-100 border border-black",
  "hidden md:block left-1/2 top-1/2 -translate-y-1/2 w-[130px] h-[220px] sm:w-[160px] sm:h-[270px] md:w-[200px] md:h-[300px] rounded-[0px] shadow-[0_20px_30px_rgba(115,115,115,0.25)_inset] opacity-100 border border-black",
  "hidden md:block top-1/2 -translate-y-1/2 left-[calc(50%+140px)] sm:left-[calc(50%+170px)] md:left-[calc(50%+220px)] w-[130px] h-[220px] sm:w-[160px] sm:h-[270px] md:w-[200px] md:h-[300px] rounded-[0px] shadow-[0_20px_30px_rgba(115,115,115,0.25)_inset] opacity-100 border border-black",
  "hidden md:block top-1/2 -translate-y-1/2 left-[calc(50%+280px)] sm:left-[calc(50%+340px)] md:left-[calc(50%+440px)] w-[130px] h-[220px] sm:w-[160px] sm:h-[270px] md:w-[200px] md:h-[300px] rounded-[0px] shadow-[0_20px_30px_rgba(115,115,115,0.25)_inset] opacity-100 border border-black",
  "hidden md:block top-1/2 -translate-y-1/2 left-[calc(50%+420px)] sm:left-[calc(50%+510px)] md:left-[calc(50%+660px)] w-[130px] h-[220px] sm:w-[160px] sm:h-[270px] md:w-[200px] md:h-[300px] rounded-[0px] shadow-[0_20px_30px_rgba(115,115,115,0.25)_inset] opacity-0 border border-black",
];

// FIX: thumbnails (index 2,3,4) must sit ABOVE the full backgrounds (index 0,1),
// otherwise the full-size background image covers them and they look "ghosted".
const zIndexes = [1, 2, 6, 5, 4, 3];

export default function ImageCarousel() {
  const [items, setItems] = useState<SlideItem[]>(initialItems);

  const handleNext = () => {
    setItems((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setItems((prev) => {
      const last = prev[prev.length - 1];
      return [last, ...prev.slice(0, -1)];
    });
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-neutral-950 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
      <ul className="absolute inset-0 list-none">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`absolute bg-center bg-cover transition-all duration-700 ease-in-out ${positionClasses[index] ?? positionClasses[positionClasses.length - 1]
              }`}
            style={{
              backgroundImage: `url(${item.image})`,
              zIndex: zIndexes[index] ?? 0,
            }}
          >
            {index === 1 && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, filter: "blur(5px)", y: 75 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.75, delay: 0.3, ease: "easeInOut" }}
                className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 w-[min(90vw,500px)] text-neutral-50"
                style={{ textShadow: "0 3px 8px rgba(0,0,0,0.5)" }}
              >
                <h2 className="font-black uppercase text-3xl md:text-3xl tracking-wide text-neutral-100">
                  {item.title}
                </h2>
                <p className="mt-4 mb-6 text-lg md:text-lg leading-relaxed text-neutral-300">
                  {item.description}
                </p>
                <Link href="/auth-page/login">
                  <button className="relative bg-neutral-950 mt-5 cursor-pointer text-neutral-50 text-xs md:text-sm font-bold uppercase tracking-widest px-5 py-5 md:px-6 md:py-5 overflow-hidden group border border-neutral-600 hover:bg-neutral-700 transition-colors duration-300">
                    <span className="absolute inset-0 bg-neutral-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                    <span className="relative z-10 group-hover:text-neutral-900 transition-colors duration-300">
                      Start Running Bot
                    </span>
                  </button>
                </Link>
              </motion.div>
            )}
          </li>
        ))}
      </ul>

      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4 select-none">
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="flex items-center justify-center w-11 h-11 rounded-0 bg-neutral-950/100 border-2 border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="flex items-center justify-center w-11 h-11 rounded-0 bg-neutral-950/100 border-2 border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-50 transition-colors cursor-pointer"
        >
          <ArrowRight size={18} />
        </button>
      </nav>
    </main>
  );
}