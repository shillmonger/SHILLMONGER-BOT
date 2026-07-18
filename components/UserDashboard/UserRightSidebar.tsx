"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Terminal,
  Plus,
  LayoutDashboard,
  Settings,
  Lock,
  Tv,
  Send,
  Trash2,
  ShieldCogCorner,
  X,
  BadgeCheck,
  Calendar,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function UserRightSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [userDb, setUserDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setUserDb(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const basePath = "/user-dashboard";

  // Navigation Links under the profile
  const navItems = [
    {
      name: "Account Settings",
      icon: User,
      href: `${basePath}/account-setting`,
    },
    {
      name: "MT5 Connection",
      icon: Tv,
      href: `${basePath}/mt5/connect`,
    },
    {
      name: "Connect Telegram",
      icon: Send,
      href: `${basePath}/telegram/connect`,
    },
    {
      name: "Switch to Admin",
      icon: Lock,
      href: `/admin-dashboard/dashboard`,
    },
  ];

  // Modal Auto-Close Countdown Logic for Delete Account
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showDeleteConfirm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowDeleteConfirm(false);
      setCountdown(10);
    }
    return () => clearTimeout(timer);
  }, [showDeleteConfirm, countdown]);

  const handleDeleteAccount = () => {
    // Perform API destruction calls here
    toast.error("Your account deletion process has been initiated.");
    setShowDeleteConfirm(false);
    setCountdown(10);
    router.push("/auth-page/register");
  };

  // Reusable component panel for desktop & mobile
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* SECTION 1: Dynamic User Profile Details */}
      <div className="border border-neutral-800 p-4 bg-neutral-900/30 space-y-4">
        <div className="flex items-center gap-4">
          {userDb?.profileImage ? (
            <img
              src={userDb.profileImage}
              alt={userDb.username}
              className="w-15 h-15 border-2 border-neutral-700 object-cover shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
            />
          ) : (
            <div className="w-15 h-15 bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
              <User className="w-6 h-6 text-neutral-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-50 truncate">
                {loading ? 'Loading...' : userDb?.username || 'User'}
              </h2>
              {userDb?.isVerified && (
                <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
              Role: <span className="text-neutral-300">{loading ? '...' : userDb?.role || 'user'}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800/60 pt-3 space-y-2 text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
          {/* <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <span className="text-neutral-300 truncate max-w-[150px]">
              {userDb.email}
            </span>
          </div> */}

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Status
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 font-black border ${userDb?.isVerified
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
            >
              {loading ? '...' : userDb?.isVerified ? "VERIFIED" : "UNVERIFIED"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Joined
            </span>
            <span className="text-neutral-300">
              {loading ? '...' : userDb?.createdAt ? new Date(userDb.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Quick Status Cards */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">System Overview</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "MT5 Connection", value: "Connected", active: true },
            { label: "Telegram Conn.", value: "Connected", active: true },
            { label: "Database", value: "Online", active: true },
            { label: "Trading Bot", value: "Running", active: true },
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


      {/* SECTION 3: Subscription */}
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






      {/* SECTION 3: Connected MT5 Account */}
      <div className="border border-neutral-800 p-4 space-y-3 bg-neutral-900/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">MT5 Terminal</h3>
        <div className="space-y-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Broker</span> <span>IC Markets</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Acc No.</span> <span className="font-mono">8273641</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Server</span> <span className="font-mono">Live-03</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Leverage</span> <span>1:500</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Acct Type</span> <span>DEMO</span></div>
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


      {/* SECTION 8: Quick Actions */}
      <div className="space-y-2 pt-2 border-t border-neutral-900">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Operations</h3>

        <div className="flex flex-col gap-2">
          <Link href="/user-dashboard/mt5-connection">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Connect MT5
            </button>
          </Link>

          <Link href="/user-dashboard/account-setting">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-50 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
              <Settings className="w-3.5 h-3.5 text-neutral-400" /> Profile Setting
            </button>
          </Link>

          {userDb?.role === 'admin' && (
            <Link href="/admin-dashboard/dashboard">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-50 hover:bg-neutral-200 text-neutral-950 text-[10px] font-black uppercase tracking-widest transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] cursor-pointer">
                <LayoutDashboard className="w-3.5 h-3.5" /> Switch to Admin
              </button>
            </Link>
          )}
        </div>
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
              BOT <span className="text-neutral-50 font-black">Automation</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              AI-Powered Trading Intelligence
            </p>
          </div>
        </div>

        {/* Scrollable Contents Panel */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          <SidebarContent />
        </div>

        {/* Danger Action - Delete Account */}
        <div className="flex-shrink-0 border-t border-neutral-800 px-4 py-2 bg-neutral-950">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-none group"
          >
            <Trash2 className="w-5 h-5 mr-3 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              Delete My Account
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
                  SIGNAL<span className="text-neutral-50 font-black"> COPIER</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  Automated Telegram-to-MT5 execution
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

            {/* Mobile Danger Action */}
            <div className="flex-shrink-0 border-t border-neutral-800 px-4 py-2 bg-neutral-950">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-none group"
              >
                <Trash2 className="w-5 h-5 mr-3 group-hover:scale-105 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Delete My Account
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-red-800 rounded-none shadow-[8px_8px_0px_0px_rgba(239,68,68,0.1)] w-full max-w-sm p-8 text-center relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-12 h-12 bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-red-500 mb-2">
              Delete Account?
            </h2>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed font-semibold uppercase tracking-wider">
              This action is permanent and irreversible. Your configuration metrics,
              connected credentials, and historical logs will be completely wiped.
            </p>

            {/* Countdown Progress Bar */}
            <div className="mb-6 border border-neutral-800 p-3 bg-neutral-900/60">
              <div className="flex justify-between text-[9px] text-neutral-400 mb-2 uppercase tracking-widest font-bold">
                <span>Confirming destruction in...</span>
                <span className="text-red-500 font-mono font-black">{countdown}s</span>
              </div>
              <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-none overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-none transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCountdown(10);
                }}
                className="flex-1 px-6 py-3 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-50 font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-3 rounded-none bg-red-600 text-neutral-50 font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-[3px_3px_0px_0px_rgba(239,68,68,0.2)] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}