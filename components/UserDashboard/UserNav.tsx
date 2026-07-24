"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ChartColumnBig,
  DatabasePlus,
  Wallet,
  Send,
  Gem,
  Settings,
} from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();
  const basePath = "/user-dashboard";

  const navItems = [
    { name: "Home", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    { name: "Plans", icon: Gem, href: `${basePath}/subscription` },
    { name: "Sync MT5", icon: DatabasePlus, href: `${basePath}/mt5-connection` },
    { name: "Sync Tg", icon: Send, href: `${basePath}/tg-setup` },
    { name: "Predict", icon: ChartColumnBig, href: `#` },
    { name: "Settings", icon: Settings, href: `${basePath}/account-setting` },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 
        flex justify-around items-center 
        bg-gradient-to-t from-indigo-950 via-neutral-950 to-neutral-950 backdrop-blur-xl
        py-2 pb-safe-bottom px-2
        border-t border-indigo-900/50
        shadow-[0_-10px_40px_-15px_rgba(79,70,229,0.15)] 
        lg:hidden select-none
      "
    >
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = isActive(href);
        
        return (
          <Link
            key={name}
            href={href}
            className={`
              flex flex-col items-center transition-all duration-300
              ${active ? "text-indigo-300 scale-105" : "text-neutral-400 hover:text-indigo-300"}
            `}
          >
            <div
              className={`
                flex items-center justify-center 
                w-12 h-12 rounded-xl mb-1.5 
                transition-all duration-300
                ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-indigo-900/30"
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 transition-transform duration-300 ${active ? "scale-110" : ""}`} 
              />
            </div>

            <span 
              className={`
                text-[9px] font-black tracking-[0.15em] uppercase transition-opacity duration-300
                ${active ? "text-indigo-300 opacity-100" : "text-neutral-400 opacity-60"}
              `}
            >
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}