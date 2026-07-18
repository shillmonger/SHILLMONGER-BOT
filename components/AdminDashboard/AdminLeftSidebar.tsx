"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Radio,
  CandlestickChart,
  History,
  Users,
  Send,
  MessageCircle,
  UserRound,
  BarChart3,
  ScrollText,
  Server,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
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

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  // Desktop sidebar expand/collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Group status tracking for collapsible sub-menus
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    MAIN: true,
    MANAGEMENT: true,
    ANALYTICS: true,
    SYSTEM: true,
  });

  // Updated to Admin Base Path
  const basePath = "/admin-dashboard";

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

  // Admin Structured Navigation Items
  const navItems: NavItem[] = [
    // === MAIN ===
    { name: "Overview", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    // { name: "Live Streams", icon: Radio, href: `${basePath}/live-signals` },
    // { name: "Active Trades", icon: CandlestickChart, href: `${basePath}/open-trades` },
    // { name: "Master History", icon: History, href: `${basePath}/trade-history` },
    { name: "BOT Provider", icon: Send, href: `${basePath}/providers` },

    // === MANAGEMENT ===
    // { name: "User Directory", icon: UserRound, href: `${basePath}/subscribers` },

    // === ANALYTICS & MONITORING ===
    // { name: "Platform Growth", icon: BarChart3, href: `${basePath}/analytics` },
    // { name: "System Audit Logs", icon: ScrollText, href: `${basePath}/activity-logs` },

    // === SYSTEM ===
    // { name: "Core Server Cluster", icon: Server, href: `${basePath}/system-status` },
    // { name: "Global Settings", icon: Settings, href: `${basePath}/settings` },
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
    // Prevent expanding menus when sidebar is closed completely
    if (isCollapsed) setIsCollapsed(false);
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex border-r border-neutral-800 h-screen sticky top-0 bg-neutral-950 flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 relative ${
          isCollapsed ? "w-18" : "w-60"
        }`}
      >
        {/* Header */}
        <div className={`flex-shrink-0 flex items-center h-16 border-b border-neutral-800 transition-all duration-300 relative ${
          isCollapsed ? "justify-center px-2" : "justify-between px-6"
        }`}>
          <div className={`flex flex-col ${isCollapsed ? "items-center" : ""}`}>
            <h1 className="text-xl font-black uppercase tracking-tighter text-neutral-50">
              {isCollapsed ? "F" : "Shill"}<span className="text-neutral-50 font-black">{isCollapsed ? "X" : "Monger"}</span>
            </h1>
            {!isCollapsed && (
              <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase whitespace-nowrap">
                Admin Control Room
              </p>
            )}
          </div>

          {/* Toggle Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 cursor-pointer bg-neutral-900 border border-neutral-800 rounded-none flex items-center justify-center text-neutral-300 hover:text-neutral-50 shadow-md hover:bg-neutral-850 transition-colors z-10"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
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
                  className={`group flex items-center rounded-none border border-transparent transition-all duration-200 ${
                    isCollapsed ? "justify-center px-0 py-3" : "px-4 py-2.5"
                  } ${
                    active
                      ? "bg-neutral-50 text-neutral-950 font-black border-neutral-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform ${isCollapsed ? "" : "mr-5"} ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-[12px] font-black uppercase tracking-widest whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            }

            const isOpen = !isCollapsed && !!openGroups[item.name];
            const hasActiveChild = item.children.some((c) => pathname === c.href);

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`group w-full flex items-center rounded-none transition-all duration-200 cursor-pointer ${
                    isCollapsed ? "justify-center px-0 py-3" : "px-4 py-2.5"
                  } ${
                    hasActiveChild
                      ? "text-neutral-50 font-black"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform ${isCollapsed ? "" : "mr-5"} ${
                      hasActiveChild ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-[12px] font-black uppercase tracking-widest whitespace-nowrap">
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                {!isCollapsed && (
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
                            <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                              {child.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className={`flex-shrink-0 border-t border-neutral-800 py-2 space-y-1 ${isCollapsed ? "px-2" : "px-4"}`}>
          {/* <Link
            href={`${basePath}/support`}
            className={`flex items-center w-full text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 transition-all rounded-none group ${
              isCollapsed ? "justify-center px-0 py-3" : "px-4 py-2"
            }`}
            title={isCollapsed ? "Support" : undefined}
          >
            <HelpCircle className={`w-5 h-5 group-hover:scale-110 transition-transform ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && (
              <span className="text-[12px] font-black uppercase tracking-widest">
                Support
              </span>
            )}
          </Link>

          <Link
            href={`${basePath}/documentation`}
            className={`flex items-center w-full text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 transition-all rounded-none group ${
              isCollapsed ? "justify-center px-0 py-3" : "px-4 py-2"
            }`}
            title={isCollapsed ? "Documentation" : undefined}
          >
            <FileText className={`w-5 h-5 group-hover:scale-110 transition-transform ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && (
              <span className="text-[12px] font-black uppercase tracking-widest">
                Documentation
              </span>
            )}
          </Link> */}

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex items-center cursor-pointer w-full text-red-500 hover:bg-red-500/10 transition-all rounded-none group ${
              isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3"
            }`}
            title={isCollapsed ? "Logout My Account" : undefined}
          >
            <LogOut className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && (
              <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                Logout Admin
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
          <aside className="fixed top-0 left-0 w-full h-full bg-neutral-950 z-50 flex flex-col shadow-2xl lg:hidden">
            {/* Mobile Header */}
            <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-neutral-800">
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase tracking-tighter text-neutral-50">
                  SECURE<span className="text-neutral-50 font-black"> RISE</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  Admin Control Room
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

            {/* Mobile Footer Links */}
            <div className="flex-shrink-0 border-t border-neutral-800 px-4 py-2 space-y-1">
              <Link
                href={`${basePath}/support`}
                className="flex items-center w-full px-4 py-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 transition-all rounded-none group"
                onClick={() => setSidebarOpen(false)}
              >
                <HelpCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-black uppercase tracking-widest">
                  Support
                </span>
              </Link>

              <Link
                href={`${basePath}/documentation`}
                className="flex items-center w-full px-4 py-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 transition-all rounded-none group"
                onClick={() => setSidebarOpen(false)}
              >
                <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-black uppercase tracking-widest">
                  Documentation
                </span>
              </Link>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-none group"
              >
                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Logout Admin
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
              Exit Panel?
            </h2>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed font-semibold">
              Are you sure you want to log out of the administration console?
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
                  toast.success("Successfully logged out of Admin Panel");
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