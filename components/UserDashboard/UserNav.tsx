"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Wallet,
  ChartSpline,
  Settings,
} from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();
  const basePath = "/user-dashboard";

  const navItems = [
    { name: "Home", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    { name: "Deposit", icon: CreditCard, href: `${basePath}/deposit` },
    { name: "Invest", icon: BarChart3, href: `${basePath}/invest` },
    { name: "Payout", icon: Wallet, href: `${basePath}/withdraw` },
    { name: "Trades", icon: ChartSpline, href: `${basePath}/my-investments` },
    { name: "Settings", icon: Settings, href: `${basePath}/user-settings` },
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
        bg-background/95 backdrop-blur-xl
        py-2 pb-safe-bottom px-2
        border-t border-border
        shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] 
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
              ${active ? "text-foreground scale-105" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <div
              className={`
                flex items-center justify-center 
                w-12 h-12 rounded-lg mb-1.5 
                transition-all duration-300
                ${
                  active
                    ? "bg-foreground text-background shadow-lg shadow-black/20"
                    : "bg-secondary/50"
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
                ${active ? "opacity-100" : "opacity-60"}
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