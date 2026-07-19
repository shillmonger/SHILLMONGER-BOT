"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Cpu,
  Server,
  User,
  Key,
  Send,
  Link2,
  Link2Off,
  AlertTriangle,
  X,
  Loader2,
  Clock,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface ConnectionDetails {
  id: string;
  telegramUsername: string;
  server: string;
  mt5Login: string;
  accountType: 'demo' | 'real';
  status: 'connected' | 'disconnected' | 'expired';
  startDate?: Date;
  expirationDate?: Date;
  subscriptionPlan?: string | null;
  subscriptionExpiryDate?: Date | null;
  balance?: number;
  equity?: number;
  currency?: string;
}

export default function MT5ConnectionPage() {
  // Form States
  const [telegramUsername, setTelegramUsername] = useState("");
  const [server, setServer] = useState("");
  const [mt5Login, setMt5Login] = useState("");
  const [tradingPassword, setTradingPassword] = useState("");

  // Connection System States
  const [isConnected, setIsConnected] = useState(false);
  const [activeDetails, setActiveDetails] = useState<ConnectionDetails | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo');
  const [serverError, setServerError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);

  // Fetch user's connected MT5 account on page load
  useEffect(() => {
    const fetchConnectedAccount = async () => {
      try {
        const response = await fetch('/api/user/mt5/account');
        const data = await response.json();

        if (response.ok && data.account) {
          setActiveDetails(data.account);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to fetch connected account:', error);
      } finally {
        setIsLoadingAccount(false);
      }
    };

    fetchConnectedAccount();
  }, []);

  const handleServerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setServer(value);

    // Validate server based on account type
    if (accountType === 'real' && value && !value.includes('Real')) {
      setServerError("REAL accounts must use servers containing 'Real' (e.g., Exness-MT5Real9)");
    } else if (accountType === 'demo' && value && !value.includes('Trial')) {
      setServerError("DEMO accounts must use servers containing 'Trial' (e.g., Exness-MT5Trial9)");
    } else {
      setServerError("");
    }
  };

  const handleAccountTypeChange = (type: 'demo' | 'real') => {
    setAccountType(type);
    setServer(""); // Clear server when switching account type
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramUsername || !server || !mt5Login || !tradingPassword) return;
    if (serverError) return;

    setIsConnecting(true);

    try {
      const response = await fetch('/api/user/mt5/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUsername,
          server,
          mt5Login,
          password: tradingPassword,
          accountType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActiveDetails(data.account);
        setIsConnected(true);
        toast.success('MT5 account connected successfully!');
      } else {
        toast.error(data.error || 'Failed to connect MT5 account');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to MT5 account');
    } finally {
      setIsConnecting(false);
      // Clear password field for security
      setTradingPassword("");
    }
  };

  const handleDisconnect = () => {
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = async () => {
    try {
      const response = await fetch('/api/user/mt5/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsConnected(false);
        setActiveDetails(null);
        setShowDisconnectModal(false);
        toast.success('MT5 account disconnected successfully');
      } else {
        toast.error(data.error || 'Failed to disconnect account');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect account');
    }
  };

  return (
    <div className="flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-8">
          
          {/* ====================================================
              SECTION 1: PAGE HEADER
             ==================================================== */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-black pb-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
                SYSTEM configuration
              </p>
              <h1 className="text-4xl md:text-3xl font-mono font-black uppercase text-neutral-950 mb-2">
                MT5 Engine Connection
              </h1>
            </div>
            <div className="bg-neutral-950 text-white border-2 border-black px-4 py-2 text-right shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                Engine Status
              </span>
              <span className={`text-xs font-mono font-bold uppercase flex items-center gap-2 ${isConnected ? "text-emerald-400" : "text-amber-400"}`}>
                <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {isConnected ? "Linked & Active" : "Unlinked"}
              </span>
            </div>
          </div>

          {/* ====================================================
              SECTION 2: MAIN GRID LAYOUT
             ==================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN LEFT: FORM AND LIVE PREVIEW (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {isLoadingAccount ? (
                <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 animate-spin text-neutral-400" />
                      <p className="text-sm font-mono text-neutral-400">Loading account status...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : !isConnected ? (
                <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="p-6">
                    <div className="border-b border-neutral-800 pb-3 mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-neutral-400" />
                        Exness Terminal Configuration
                      </h2>
                      <Cpu className="h-4 w-4 text-neutral-400" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Account Type Toggle */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                          <Cpu className="h-3 w-3" /> Account Type
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAccountTypeChange('demo')}
                            className={`flex-1 py-3 px-4 rounded-none font-mono font-black text-xs uppercase tracking-wider transition-all border-2 ${
                              accountType === 'demo'
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)]'
                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600'
                            }`}
                          >
                            DEMO
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAccountTypeChange('real')}
                            className={`flex-1 py-3 px-4 rounded-none font-mono font-black text-xs uppercase tracking-wider transition-all border-2 ${
                              accountType === 'real'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-[3px_3px_0px_0px_rgba(244,63,94,0.3)]'
                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600'
                            }`}
                          >
                            REAL
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Telegram Username Input */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                            <Send className="h-3 w-3" /> TG Username
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. shillmonger_trades"
                            value={telegramUsername}
                            onChange={(e) => setTelegramUsername(e.target.value)}
                            className="w-full rounded-none bg-neutral-900 border border-neutral-800 p-3 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>

                        {/* Server Input */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                            <Server className="h-3 w-3" /> Exness Server
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder={accountType === 'real' ? "e.g. Exness-MT5Real9" : "e.g. Exness-MT5Trial9"}
                            value={server}
                            onChange={handleServerChange}
                            className={`w-full rounded-none bg-neutral-900 border p-3 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none transition-colors ${
                              serverError ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-800 focus:border-white'
                            }`}
                          />
                          {serverError && (
                            <p className="text-[9px] text-rose-400 font-semibold uppercase tracking-wider">
                              {serverError}
                            </p>
                          )}
                        </div>

                        {/* MT5 Login Input */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                            <User className="h-3 w-3" /> MT5 Login ID
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. 84729402"
                            value={mt5Login}
                            onChange={(e) => setMt5Login(e.target.value)}
                            className="w-full rounded-none bg-neutral-900 border border-neutral-800 p-3 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>

                        {/* Trading Password Input */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                            <Key className="h-3 w-3" /> Trading Password
                          </label>
                          <input 
                            type="password" 
                            required
                            placeholder="••••••••••••"
                            value={tradingPassword}
                            onChange={(e) => setTradingPassword(e.target.value)}
                            className="w-full rounded-none bg-neutral-900 border border-neutral-800 p-3 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isConnecting}
                        className="w-full mt-4 rounded-none cursor-pointer bg-white text-neutral-950 font-mono font-black uppercase tracking-wider p-3 border-2 border-transparent hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Initialize AI Bridge Connection
                          </>
                        )}
                      </button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                /* Connected State Success Display Card */
                <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="p-6 space-y-6">
                    <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                      <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        Active Bridge Configuration
                      </h2>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5">
                        SECURE LOGGED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-neutral-900/60 border border-neutral-800/80">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Telegram User</span>
                        <span className="text-sm font-bold font-mono text-white">@{activeDetails?.telegramUsername}</span>
                      </div>
                      <div className="p-3 bg-neutral-900/60 border border-neutral-800/80">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">MT5 Server</span>
                        <span className="text-sm font-bold font-mono text-white">{activeDetails?.server}</span>
                      </div>
                      <div className="p-3 bg-neutral-900/60 border border-neutral-800/80">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Login Reference</span>
                        <span className="text-sm font-bold font-mono text-white">{activeDetails?.mt5Login}</span>
                      </div>
                      <div className={`p-3 border ${activeDetails?.accountType === 'demo' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Account Type</span>
                        <span className={`text-sm font-bold font-mono uppercase ${activeDetails?.accountType === 'demo' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {activeDetails?.accountType || 'DEMO'}
                        </span>
                      </div>
                    </div>

                    {/* Demo Account Expiration Info */}
                    {activeDetails?.accountType === 'demo' && activeDetails.expirationDate && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Demo Account Expiration</p>
                          <p className="text-xs text-neutral-300 font-semibold">
                            Expires: {new Date(activeDetails.expirationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Real Account Subscription Info */}
                    {activeDetails?.accountType === 'real' && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Subscription Status</p>
                          {activeDetails.subscriptionPlan ? (
                            <p className="text-xs text-neutral-300 font-semibold">
                              {activeDetails.subscriptionPlan} - Active
                            </p>
                          ) : (
                            <p className="text-xs text-neutral-300 font-semibold">
                              No active subscription - Please subscribe to continue
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-neutral-900/30 border border-dashed border-neutral-800 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                        Your trading architecture is fully containerized. The system is scanning global order books via the active connection metrics. Changing keys or metrics will immediately break structural pipelines.
                      </p>
                    </div>

                    <button
                      onClick={handleDisconnect}
                      className="w-full rounded-none cursor-pointer bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-black uppercase tracking-wider p-3 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Link2Off className="h-4 w-4" />
                      Disconnect Bridge Architecture
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* COLUMN RIGHT: REALTIME INPUT FIELD PREVIEW (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-6">
                  <div className="border-b border-neutral-800 pb-3 mb-4">
                    <h2 className="text-sm font-black uppercase tracking-tighter text-neutral-400">
                      Live Stream Registry Preview
                    </h2>
                  </div>
                  
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                      <span className="text-neutral-500 font-bold uppercase">TG_ID</span>
                      <span className={telegramUsername ? "text-white font-bold" : "text-neutral-700 italic"}>
                        {telegramUsername ? `@${telegramUsername}` : "[Waiting for input]"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                      <span className="text-neutral-500 font-bold uppercase">TARGET_SRV</span>
                      <span className={server ? "text-white font-bold" : "text-neutral-700 italic"}>
                        {server || "[Waiting for input]"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                      <span className="text-neutral-500 font-bold uppercase">MT5_USER</span>
                      <span className={mt5Login ? "text-white font-bold" : "text-neutral-700 italic"}>
                        {mt5Login || "[Waiting for input]"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                      <span className="text-neutral-500 font-bold uppercase">ACCT_TYPE</span>
                      <span className={accountType ? (accountType === 'demo' ? "text-emerald-400 font-bold" : "text-rose-400 font-bold") : "text-neutral-700 italic"}>
                        {accountType ? accountType.toUpperCase() : "[Waiting for selection]"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-neutral-500 font-bold uppercase">SECRET_SALT</span>
                      <span className={tradingPassword ? "text-amber-400 font-bold" : "text-neutral-700 italic"}>
                        {tradingPassword ? "•••••••• (Buffered)" : "[Awaiting security payload]"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety/Information Notice */}
              <div className="bg-neutral-950 text-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
                  Security standard
                </span>
                <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                  End-to-end socket encryptions route parameters cleanly into isolated worker tasks. Your primary execution key balances remain secured inside isolated broker execution spaces.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowDisconnectModal(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-rose-900 rounded-none shadow-[8px_8px_0px_0px_rgba(239,68,68,0.2)] w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDisconnectModal(false)}
              className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Link2Off className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                Disconnect Bridge?
              </h2>
            </div>

            <p className="text-sm text-neutral-400 mb-6 leading-relaxed font-semibold">
              Are you sure you want to disconnect your Exness account from the AI Engine? This will terminate all active trading pipelines and signal execution.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 px-4 py-3 cursor-pointer  rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="flex-1 px-4 py-3 cursor-pointer  rounded-none bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-[3px_3px_0px_0px_rgba(239,68,68,0.3)]"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}