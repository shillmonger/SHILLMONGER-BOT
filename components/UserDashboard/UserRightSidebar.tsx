"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  User,
  ShieldAlert,
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

  // Mocked database object based on your provided schema structure
  const userDb = {
    username: "shillmonger",
    email: "shillmonger0@gmail.com",
    role: "user",
    isVerified: true,
    profileImage: "/PFP_IMG/14.jfif",
    createdAt: "2026-07-16T21:27:18.458Z",
  };

  const basePath = "/user-dashboard";

  // Navigation Links under the profile
  const navItems = [
    {
      name: "Account Settings",
      icon: User,
      href: `${basePath}/account-setting`,
    },
    {
      name: "Security Settings",
      icon: ShieldCogCorner,
      href: `${basePath}/settings/2fa`,
    },
    {
      name: "MT5 Connection",
      icon: Tv,
      href: `${basePath}/mt5/connect`,
    },
    {
      name: "Telegram Connection",
      icon: Send,
      href: `${basePath}/telegram/connect`,
    },
    {
      name: "Switch to Admin",
      icon: Lock,
      href: `${basePath}/telegram/connect`,
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
          <div className="relative w-15 h-15 bg-neutral-800 border-2 border-neutral-700 flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
            {userDb.profileImage ? (
              <Image
                src={userDb.profileImage}
                alt={userDb.username}
                fill
                className="object-cover"
                sizes="56px"
                priority
              />
            ) : (
              <User className="w-6 h-6 text-neutral-400 m-auto mt-3" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-50 truncate">
                {userDb.username}
              </h2>
              {userDb.isVerified && (
                <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
              Role: <span className="text-neutral-300">{userDb.role}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800/60 pt-3 space-y-2 text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <span className="text-neutral-300 truncate max-w-[150px]">
              {userDb.email}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Status
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 font-black border ${
                userDb.isVerified
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}
            >
              {userDb.isVerified ? "VERIFIED" : "UNVERIFIED"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5" /> Joined
            </span>
            <span className="text-neutral-300">
              {new Date(userDb.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Navigation Links */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2.5">
          Workspace Pages
        </h3>
        <div className="grid grid-cols-1 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3 border transition-all duration-200 ${
                  active
                    ? "bg-neutral-50 text-neutral-950 font-black border-neutral-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
                    : "border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-transform ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="text-[10.5px] font-black uppercase tracking-widest">
                    {item.name}
                  </span>
                </span>
              </Link>
            );
          })}
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