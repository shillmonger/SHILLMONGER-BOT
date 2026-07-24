"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  History,
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
  const [mt5Account, setMt5Account] = useState<any>(null);
  const [mt5Loading, setMt5Loading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

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

  // Fetch MT5 account data
  useEffect(() => {
    const fetchMt5Account = async () => {
      try {
        const response = await fetch('/api/user/mt5/account');
        if (response.ok) {
          const data = await response.json();
          if (data.accounts && data.accounts.length > 0) {
            // Get the connected account or the most recent one
            const connectedAccount = data.accounts.find((acc: any) => acc.status === 'connected') || data.accounts[0];
            setMt5Account(connectedAccount);
          } else {
            setMt5Account(null);
          }
        } else {
          setMt5Account(null);
        }
      } catch (error) {
        console.error('Failed to fetch MT5 account data:', error);
        setMt5Account(null);
      } finally {
        setMt5Loading(false);
      }
    };

    fetchMt5Account();
  }, []);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscription(data.subscription);
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
        setSubscription(null);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchSubscription();
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
      <div className="border border-indigo-900/50 p-4 bg-indigo-950/30 rounded-2xl space-y-4">
        <div className="flex items-center gap-4">
          {userDb?.profileImage ? (
            <img
              src={userDb.profileImage}
              alt={userDb.username}
              className="w-20 h-20 border-2 border-indigo-700 object-cover rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-indigo-900 border-2 border-indigo-700 flex items-center justify-center rounded-full">
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

        <div className="border-t border-indigo-900/60 pt-3 space-y-2 text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
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
            { 
              label: "MT5 Connection", 
              value: mt5Loading ? "Loading..." : !mt5Account ? "Not Connected" : mt5Account.status === 'connected' ? "Connected" : mt5Account.status === 'disconnected' ? "Disconnected" : mt5Account.status === 'expired' ? "Expired" : "Not Connected",
              color: mt5Loading ? "neutral" : !mt5Account ? "red" : mt5Account.status === 'connected' ? "emerald" : (mt5Account.status === 'disconnected' || mt5Account.status === 'expired') ? "yellow" : "red"
            },
            { 
              label: "Telegram Conn.", 
              value: mt5Loading ? "Loading..." : mt5Account?.telegramUsername ? "Connected" : "Not Connected",
              color: mt5Loading ? "neutral" : mt5Account?.telegramUsername ? "emerald" : "red"
            },
            { 
              label: "Database", 
              value: loading ? "Loading..." : "Online",
              color: loading ? "neutral" : "emerald"
            },
            { 
              label: "Trading Bot", 
              value: mt5Loading ? "Loading..." : mt5Account?.status === 'connected' ? "Running" : "Idle",
              color: mt5Loading ? "neutral" : mt5Account?.status === 'connected' ? "emerald" : "red"
            },
          ].map((status, index) => (
            <div key={index} className="border border-indigo-900/50 bg-indigo-950/20 p-2.5 flex flex-col justify-between rounded-xl">
              <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 leading-tight mb-1">{status.label}</span>
              <div className="flex items-center gap-1.5">
                {/* Change this line by adding flex-shrink-0 */}
<span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
  status.color === "emerald" ? "bg-emerald-500" : 
  status.color === "yellow" ? "bg-yellow-500" : 
  status.color === "amber" ? "bg-yellow-500" : 
  status.color === "neutral" ? "bg-neutral-500" : 
  "bg-red-500"
}`} />
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-200">{status.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* SECTION 3: Subscription */}
      <div className="border border-neutral-800 rounded-xl p-4 space-y-3 bg-neutral-900/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Billing</h3>
        {subscriptionLoading ? (
          <div className="text-[10px] text-neutral-500">Loading...</div>
        ) : subscription ? (
          <div className="space-y-2">
            <div className="space-y-1 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
              <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Plan</span> <span>{subscription.planType}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Amount</span> <span className="text-emerald-400">${subscription.amount}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Account Size</span> <span>{subscription.accountSize}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Duration</span> <span>{subscription.duration}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Start Date</span> <span className="text-neutral-400">{new Date(subscription.startDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Expires</span> <span className="text-neutral-400">{new Date(subscription.expirationDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-[10px]">Status</span>
                <span className={`text-[9px] px-1.5 py-0.5 font-black border ${
                  subscription.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : subscription.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : subscription.status === 'rejected'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                }`}>
                  {subscription.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-neutral-500">No active subscription</div>
        )}
        <Link href="/user-dashboard/subscription" onClick={() => setSidebarOpen(false)}>
        <button className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl cursor-pointer">
          {subscription ? 'Manage Plan' : 'Upgrade Plan'}
        </button>
        </Link>
      </div>






      {/* SECTION 3: Connected MT5 Account */}
      <div className="border border-neutral-800 rounded-xl p-4 space-y-3 bg-neutral-900/10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">MT5 Terminal</h3>
        <div className="space-y-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Broker</span> <span>{mt5Loading ? '...' : mt5Account?.server?.split('-')[0] || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Acc No.</span> <span className="font-mono">{mt5Loading ? '...' : mt5Account?.mt5Login || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Server</span> <span className="font-mono">{mt5Loading ? '...' : mt5Account?.server || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Acct Type</span> <span>{mt5Loading ? '...' : mt5Account?.accountType?.toUpperCase() || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Balance</span> <span className="text-emerald-400 font-mono">{mt5Loading ? '...' : mt5Account?.balance ? `${mt5Account.currency || 'USD'} ${mt5Account.balance.toLocaleString()}` : 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500 text-[10px]">Equity</span> <span className="text-emerald-400 font-mono">{mt5Loading ? '...' : mt5Account?.equity ? `${mt5Account.currency || 'USD'} ${mt5Account.equity.toLocaleString()}` : 'N/A'}</span></div>
          <div className="flex justify-between">
            <span className="text-neutral-500 text-[10px]">Status</span>
            <span className={`text-[9px] px-1.5 py-0.5 font-black border ${
              mt5Loading 
                ? 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                : mt5Account?.status === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : mt5Account?.status === 'disconnected'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            }`}>
              {mt5Loading ? '...' : mt5Account?.status?.toUpperCase() || 'N/A'}
            </span>
          </div>
        </div>
        <Link href="/user-dashboard/mt5-connection" onClick={() => setSidebarOpen(false)}>
          <button className="w-full text-center py-2 border border-indigo-800 bg-indigo-900 hover:bg-indigo-800 text-indigo-300 text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl cursor-pointer">
            Manage MT5
          </button>
        </Link>
      </div>


      {/* SECTION 8: Quick Actions */}
      <div className="space-y-2 pt-2 border-t border-indigo-900/50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Operations</h3>

        <div className="flex flex-col gap-2">
          <Link href="/user-dashboard/transactions" onClick={() => setSidebarOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-indigo-800 hover:bg-indigo-900/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl cursor-pointer">
              <History className="w-3.5 h-3.5 text-neutral-400" /> Transactions
            </button>
          </Link>

          <Link href="/user-dashboard/account-setting" onClick={() => setSidebarOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-indigo-800 hover:bg-indigo-900/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl cursor-pointer">
              <Settings className="w-3.5 h-3.5 text-neutral-400" /> Profile Setting
            </button>
          </Link>

          {userDb?.role === 'admin' && (
            <Link href="/admin-dashboard/dashboard" onClick={() => setSidebarOpen(false)}>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl cursor-pointer">
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
      <aside className="hidden md:flex w-70 border-l border-indigo-900/50 h-screen sticky top-0 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 flex-col shadow-[-4px_0_24px_rgba(79,70,229,0.15)]">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-indigo-900/50">
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
        <div className="flex-shrink-0 border-t border-indigo-900/50 px-4 py-2 bg-neutral-950">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center cursor-pointer w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all rounded-xl group"
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
          <aside className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 z-[500] flex flex-col shadow-2xl lg:hidden">
            {/* Mobile Header */}
            <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-indigo-900/50">
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase tracking-tighter text-neutral-50">
                  BOT<span className="text-neutral-50 font-black"> AUTOMATION</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  Automated Telegram-to-MT5 execution
                </p>
              </div>
              <button
                className="rounded-xl text-neutral-50 p-1 border border-indigo-800 bg-indigo-900"
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
            <div className="flex-shrink-0 border-t border-indigo-900/50 px-4 py-2 bg-neutral-950">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex items-center cursor-pointer w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all rounded-xl group"
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
            className="bg-neutral-950 border-2 border-red-800 rounded-2xl w-full max-w-sm p-8 text-center relative animate-in fade-in zoom-in duration-200"
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
            <div className="mb-6 border border-neutral-800 p-3 bg-neutral-900/60 rounded-xl">
              <div className="flex justify-between text-[9px] text-neutral-400 mb-2 uppercase tracking-widest font-bold">
                <span>Confirming destruction in...</span>
                <span className="text-red-500 font-mono font-black">{countdown}s</span>
              </div>
              <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-linear"
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
                className="flex-1 px-6 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-300 font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-colors border border-red-500 cursor-pointer"
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