"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  HeartPlus,
  Users,
  Info,
  Lightbulb,
  HandFist,
  Gem,
  Send,
  UsersRound,
  DatabaseX,
  DatabasePlus,
  Unplug,
  Trophy,
  Package,
  ChartColumnBig,
  CandlestickChart,
  ServerCog,
  Headset,
  BarChart3,
  BadgeQuestionMark,
  History,
  CreditCard,
  LinkIcon,
  Bell,
  UserCircle,
  LifeBuoy,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type NavItem =
  | { name: string; icon: React.ElementType; href: string }
  | {
      name: string;
      icon: React.ElementType;
      children: { name: string; icon: React.ElementType; href: string }[];
    };

export default function UserSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isCollapsed, setIsCollapsed] = useState(true); // Controls desktop collapse state - default hidden

  // Load collapse state from localStorage on mount (desktop only)
  useEffect(() => {
    const savedState = localStorage.getItem('leftSidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapse state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('leftSidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  // Group status tracking for collapsible panels
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "MetaTrader 5": true,
    "My Copier": true,
    "Subscription": true,
    "Community": true,
  });

  const basePath = "/user-dashboard";

  // Modal Auto-Close Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showLogoutConfirm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLogoutConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showLogoutConfirm, countdown]);

  const navItems: NavItem[] = [
    // === HOME ===
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },
      { name: "Subscription", icon: Gem, href: `${basePath}/subscription` },
    {
      name: "MetaTrader 5",
      icon: Unplug,
      children: [
        {
          name: "Connect MT5",
          icon: DatabasePlus,
          href: `${basePath}/mt5-connection`,
        },
        // {
        //   name: "Connect TG",
        //   icon: Send,
        //   href: `${basePath}/mt5-accounts/manage`,
        // },
        {
          name: "How to setup",
          icon: BadgeQuestionMark,
          href: `${basePath}/mt5-accounts/details`,
        },
      ],
    },

    // { name: "Open Trades", icon: Package, href: `${basePath}/open-trades` },
    { name: "Transactions", icon: History, href: `${basePath}/transactions` },
    {
        name: "Predict Market",
        icon: ChartColumnBig,
        href: `${basePath}/predict`,
      },

 
     {
    name: "Community",
    icon: Users,
    children: [
      { name: "TG Channel", icon: UsersRound, href: `#` },
      { name: "Refer users", icon: HeartPlus, href: `${basePath}/referal` },
      // { name: "Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
    ],
  },
     { name: "Notifications", icon: Bell, href: `${basePath}/notifications` },
     { name: "Help Center", icon: Headset, href: `${basePath}/help-center` },
     { name: "Account Settings", icon: Settings, href: `${basePath}/account-setting` },
  ];

  // Auto-expand groups containing active pathnames
  useEffect(() => {
    navItems.forEach((item) => {
      if ("children" in item) {
        const hasActive = item.children.some((child) => pathname === child.href);
        if (hasActive) {
          setOpenGroups((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex border-r border-neutral-800 h-screen sticky top-0 bg-neutral-950 flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-65"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-neutral-800 relative">
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden transition-opacity duration-200">
              <h1 className="text-xl font-black uppercase tracking-tighter text-neutral-50 truncate">
                XAUUSD<span className="text-neutral-50 font-black"> BOT</span>
              </h1>
              <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase truncate">
                Your Investments, Our Traders
              </p>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto text-xl font-black text-neutral-50">
              FX
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 cursor-pointer bg-neutral-900 border border-neutral-800 rounded-none flex items-center justify-center text-neutral-300 hover:text-neutral-50 shadow-md hover:bg-neutral-850 transition-colors z-10"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          {navItems.map((item) => {
            if ("href" in item) {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={`group flex items-center rounded-none border border-transparent transition-all duration-200 ${
                    isCollapsed ? "justify-center px-2 py-3" : "px-4 py-2.5"
                  } ${
                    active
                      ? "bg-neutral-50 text-neutral-950 font-black border-neutral-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform flex-shrink-0 ${
                      isCollapsed ? "" : "mr-5"
                    } ${active ? "scale-110" : "group-hover:scale-110"}`}
                  />
                  {!isCollapsed && (
                    <span className="text-[12px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            }

            const isOpen = !!openGroups[item.name];
            const hasActiveChild = item.children.some((c) => pathname === c.href);

            // When collapsed, show folder as icon that expands sidebar on click
            if (isCollapsed) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsCollapsed(false)}
                  title={item.name}
                  className="group w-full flex items-center justify-center px-2 py-3 rounded-none transition-all duration-200 cursor-pointer text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                >
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>
              );
            }

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`group w-full flex items-center px-4 py-2.5 rounded-none transition-all duration-200 cursor-pointer ${
                    hasActiveChild
                      ? "text-neutral-50 font-black"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-5 transition-transform ${
                      hasActiveChild ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div className={`${isOpen ? "block" : "hidden"} transition-all duration-300`}>
                  <div className="ml-4 mt-1 mb-1 pl-4 border-l-2 border-neutral-800 space-y-1">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center gap-3 px-3 py-2 rounded-none border border-transparent transition-all duration-200 ${
                            childActive
                              ? "bg-neutral-50 text-neutral-950 font-black border-neutral-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
                              : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                          }`}
                        >
                          <child.icon
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              childActive ? "scale-110" : "group-hover:scale-110"
                            }`}
                          />
                          <span className="text-[11px] font-black uppercase tracking-widest">
                            {child.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-neutral-800 px-3 py-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            title={isCollapsed ? "Logout My Account" : undefined}
            className={`flex items-center cursor-pointer w-full text-red-500 hover:bg-red-500/10 transition-all rounded-none group ${
              isCollapsed ? "justify-center py-3" : "px-4 py-3"
            }`}
          >
            <LogOut className={`w-5 h-5 transition-transform group-hover:-translate-x-0.5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && (
              <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                Logout My Account
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-full h-full bg-neutral-950 z-500 flex flex-col shadow-2xl lg:hidden">
            {/* Mobile Header */}
            <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-neutral-800">
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase tracking-tighter text-neutral-50">
                  XAUUSD<span className="text-neutral-50 font-black"> BOT</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  Your Investments, Our Traders
                </p>
              </div>
              <button
                className="rounded-none text-neutral-50 p-1 border border-neutral-800 bg-neutral-900"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {navItems.map((item) => {
                if ("href" in item) {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-2.5 rounded-none border border-transparent transition-all duration-200 ${
                        active
                          ? "bg-neutral-50 text-neutral-950 font-black border-neutral-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-5 transition-transform ${
                          active ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="text-[12px] font-black uppercase tracking-widest">
                        {item.name}
                      </span>
                    </Link>
                  );
                }

                const isOpen = !!openGroups[item.name];
                const hasActiveChild = item.children.some((c) => pathname === c.href);

                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => toggleGroup(item.name)}
                      className={`group w-full flex items-center px-4 py-2.5 rounded-none transition-all duration-200 cursor-pointer ${
                        hasActiveChild
                          ? "text-neutral-50 font-black"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-5 transition-transform ${
                          hasActiveChild ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest">
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div className={`${isOpen ? "block" : "hidden"} transition-all duration-300`}>
                      <div className="ml-4 mt-1 mb-1 pl-4 border-l-2 border-neutral-800 space-y-1">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`group flex items-center gap-3 px-3 py-2 rounded-none border border-transparent transition-all duration-200 ${
                                childActive
                                  ? "bg-neutral-50 text-neutral-950 font-black border-neutral-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
                                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <child.icon
                                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                  childActive ? "scale-110" : "group-hover:scale-110"
                                }`}
                              />
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {child.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="flex-shrink-0 border-t border-neutral-800 px-4 py-2">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-none group"
              >
                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Logout My Account
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-neutral-800 rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-full max-w-sm p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black uppercase tracking-tighter text-neutral-50 mb-2">
              Logout?
            </h2>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed font-semibold">
              Are you sure you want to sign out? You'll need to log in again to
              access your account.
            </p>

            {/* Countdown Progress Bar */}
            <div className="mb-6 border border-neutral-800 p-3 bg-neutral-900/60">
              <div className="flex justify-between text-[10px] text-neutral-400 mb-2 uppercase tracking-widest font-bold">
                <span>Auto-closing in...</span>
                <span>{countdown}s</span>
              </div>
              <div className="w-full bg-neutral-850 border border-neutral-800 h-2.5 rounded-none overflow-hidden">
                <div
                  className="bg-neutral-50 h-full rounded-none transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-50 font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  router.push("/auth-page/login");
                  toast.success("Successfully signed out");
                  setShowLogoutConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-none bg-neutral-50 text-neutral-950 font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer animate-pulse"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}