"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Database,
  Cpu,
  Shield,
  Key,
  Bell,
  RefreshCw,
  Plus,
  Terminal,
  LayoutDashboard,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function UserRightSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);

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

  // Combined Content Render to ensure identical desktop/mobile panels
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* SECTION 1: Profile Summary */}
      <div className="border border-neutral-800 p-4 bg-neutral-900/30 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center font-black text-lg text-neutral-50 uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
            JD
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-50">John Doe</h2>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Professional Plan</p>
          </div>
        </div>
        <div className="space-y-1.5 text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
          <div className="flex justify-between">
            <span className="text-neutral-500">Email</span>
            <span className="text-neutral-300">john@email.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Joined</span>
            <span className="text-neutral-300">July 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">ID</span>
            <span className="text-neutral-300 font-mono">USR-000231</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Quick Status Cards */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">System Overview</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Email Verification", value: "Verified", active: true },
            { label: "MT5 Connection", value: "Connected", active: true },
            { label: "Telegram Conn.", value: "Connected", active: true },
            { label: "Database", value: "Online", active: true },
            { label: "Trade Copier", value: "Running", active: true },
            { label: "System Health", value: "Healthy", active: true },
          ].map((status, index) => (
            <div key={index} className="border border-neutral-800 bg-neutral-900/20 p-2.5 flex flex-col justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 leading-tight mb-1">{status.label}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${status.active ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-200">{status.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Connected MT5 Account */}
      <div className="border border-neutral-800 p-4 space-y-3 bg-neutral-900/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">MT5 Terminal</h3>
        <div className="space-y-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Broker</span> <span>IC Markets</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Acc No.</span> <span className="font-mono">8273641</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Server</span> <span className="font-mono">Live-03</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Leverage</span> <span>1:500</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Balance</span> <span className="text-emerald-400 font-mono">$10,482.50</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Equity</span> <span className="text-emerald-400 font-mono">$10,482.50</span></div>
          <div className="flex justify-between">
            <span className="text-neutral-500 text-[10px]">Status</span> 
            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 font-black border border-emerald-500/20">CONNECTED</span>
          </div>
        </div>
        <button className="w-full text-center py-2 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          Manage MT5
        </button>
      </div>

      {/* SECTION 4: Telegram Source */}
      <div className="border border-neutral-800 p-4 space-y-3 bg-neutral-900/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Telegram Feeds</h3>
        <div className="space-y-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Connected Groups</span> <span>4 Active</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Active Providers</span> <span>2 Sources</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Signals Today</span> <span className="font-mono">14 Signals</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Last Signal</span> <span className="font-mono text-neutral-400">14:32:01 UTC</span></div>
        </div>
        <button className="w-full text-center py-2 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          Manage Telegram
        </button>
      </div>

      {/* SECTION 5: Subscription */}
      <div className="border border-neutral-800 p-4 space-y-3 bg-neutral-900/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Billing</h3>
        <div className="space-y-1 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Current Plan</span> <span>Pro Plan</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Renewal Date</span> <span className="text-neutral-400">Aug 16, 2026</span></div>
        </div>
        <button className="w-full text-center py-2.5 bg-neutral-50 hover:bg-neutral-200 text-neutral-950 text-[10px] font-black uppercase tracking-widest transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] cursor-pointer">
          Upgrade Plan
        </button>
      </div>

      {/* SECTION 6: Security Actions */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">Gatekeeper Security</h3>
        <div className="grid grid-cols-1 gap-1">
          {[
            { label: "Change Password", icon: Key },
            { label: "Enable 2FA", icon: Shield },
            { label: "Manage API Keys", icon: Terminal },
            { label: "Session History & Devices", icon: Cpu },
          ].map((action, idx) => (
            <button key={idx} className="flex items-center justify-between px-3 py-2 border border-neutral-800 hover:bg-neutral-900 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-50 transition-all cursor-pointer">
              <span className="flex items-center gap-2">
                <action.icon className="w-3.5 h-3.5 text-neutral-500" />
                {action.label}
              </span>
              <ChevronRight className="w-3 h-3 text-neutral-600" />
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 7: Recent Alerts */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Activity Stream</h3>
        <div className="space-y-2">
          {[
            { text: "Trade Executed: BUY EURUSD", desc: "Copier Engine • Just now" },
            { text: "Telegram Feeds Connected", desc: "Telegram API • 15m ago" },
            { text: "MT5 Terminal Sync Complete", desc: "Gateway Server • 1h ago" },
            { text: "Subscription renewed successfully", desc: "System Billing • 1d ago" },
          ].map((alert, idx) => (
            <div key={idx} className="border-l-2 border-neutral-800 pl-3 py-0.5 space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-200 leading-tight">{alert.text}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">{alert.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 8: Quick Actions */}
      <div className="space-y-2 pt-2 border-t border-neutral-900">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Operations</h3>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add MT5 Account
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Connect Telegram Feed
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" /> View System Logs
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-50 hover:bg-neutral-200 text-neutral-950 text-[10px] font-black uppercase tracking-widest transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] cursor-pointer">
          <LayoutDashboard className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-70 border-l border-neutral-800 h-screen sticky top-0 bg-neutral-950 flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-neutral-800">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-neutral-50">
              SECURE<span className="text-neutral-50 font-black"> RISE</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Copier Terminal & Control
            </p>
          </div>
        </div>

        {/* Scrollable Contents Panel */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          <SidebarContent />
        </div>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-neutral-800 px-4 py-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-none group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              Logout My Account
            </span>
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
                  Copier Terminal & Control
                </p>
              </div>
              <button
                className="rounded-none text-neutral-50 p-1 border border-neutral-800 bg-neutral-900"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav contents */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              <SidebarContent />
            </div>

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