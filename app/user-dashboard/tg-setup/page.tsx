"use client";

import { useState, useEffect } from "react";
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  CircleOff, 
  BadgeCheck, 
  Smartphone, 
  Link2, 
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TelegramSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [telegramData, setTelegramData] = useState<{
    username?: string;
    connectedDate?: string;
    telegramId?: string;
  }>({});
  // Fetch current Telegram connection status from backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/user/telegram/status');
        const data = await response.json();
        
        if (data.connected) {
          setIsConnected(true);
          setTelegramData({
            username: data.username,
            connectedDate: data.connectedDate ? new Date(data.connectedDate).toLocaleDateString() : undefined,
            telegramId: data.chatId,
          });
        }
      } catch (err) {
        console.error('Failed to fetch Telegram status:', err);
      }
    };

    fetchStatus();
  }, []);

  const handleConnectTelegram = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Generate secure token from backend
      const response = await fetch('/api/user/telegram/generate-token', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate token');
      }
      
      // 2. Open Telegram bot in new tab with token
      window.open(`https://t.me/ShillmongerBot?start=${data.token}`, '_blank');
      
      // Stop loading state - user will complete connection in Telegram
      setIsLoading(false);
      
    } catch (err) {
      setIsLoading(false);
      setError("Unable to connect your Telegram account. Please try again.");
      console.error('Telegram connection error:', err);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/telegram/disconnect', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to disconnect');
      }
      
      setIsLoading(false);
      setIsConnected(false);
      setTelegramData({});
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setIsLoading(false);
      setError("Unable to disconnect your Telegram account. Please try again.");
      console.error('Telegram disconnect error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 font-sans">
      <main className="flex items-start justify-center">
        <div className="w-full max-w-7xl space-y-8">

          {/* ====================================================
              SECTION 1: HERO
             ==================================================== */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-950">
              Sync Telegram
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
              Securely link your Telegram account to receive notifications and enable Telegram-powered features.
            </p>
          </div>

          {/* ====================================================
              SECTION 2: SUCCESS ALERT
             ==================================================== */}
          {success && (
            <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-0.5">
                  Telegram connected successfully
                </p>
                <p className="text-xs text-emerald-700/80">
                  You can now receive notifications from our platform.
                </p>
              </div>
            </div>
          )}

          {/* ====================================================
              SECTION 3: ERROR ALERT
             ==================================================== */}
          {error && (
            <div className="p-4 bg-red-500/10 border-2 border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-red-600 uppercase tracking-wider mb-0.5">
                  Connection Failed
                </p>
                <p className="text-xs text-red-700/80">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ====================================================
              SECTION 4: CONNECTION STATUS CARD
             ==================================================== */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-none lg:shadow-none lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex items-center justify-between mb-6 gap-3">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tighter text-white mb-1">
                    Connection Status
                  </h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Current Telegram Link Status
                  </p>
                </div>
                <div className={`flex-shrink-0 px-3 py-1.5 border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  isConnected 
                    ? "bg-[#229ED9]/10 text-[#4FC3F7] border-[#229ED9]/30" 
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}>
                  {isConnected ? "Connected" : "Not Connected"}
                </div>
              </div>

              {!isConnected ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-neutral-900/60 border border-neutral-800">
                    <CircleOff className="w-7 h-7 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-white mb-1">
                        Your Telegram account has not been linked yet
                      </p>
                      <p className="text-xs text-neutral-400">
                        Connect to start receiving notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleConnectTelegram}
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-black"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" fill="white" strokeWidth={1} />
                        Connect Telegram
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {telegramData.username && (
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                          Username
                        </p>
                        <p className="text-sm sm:text-base font-mono font-bold text-white truncate">
                          {telegramData.username}
                        </p>
                      </div>
                    )}
                    {telegramData.telegramId && (
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                          Telegram ID
                        </p>
                        <p className="text-sm sm:text-base font-mono font-bold text-white truncate">
                          {telegramData.telegramId}
                        </p>
                      </div>
                    )}
                    {telegramData.connectedDate && (
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                          Connected Date
                        </p>
                        <p className="text-sm sm:text-base font-mono font-bold text-white truncate">
                          {telegramData.connectedDate}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleConnectTelegram}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-black"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Reconnecting...
                        </>
                      ) : (
                        "Reconnect"
                      )}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ====================================================
              SECTION 7: HOW IT WORKS
             ==================================================== */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-neutral-950 mb-5 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  step: 1,
                  icon: Link2,
                  title: "Click Connect Telegram",
                  description: "Initiate the connection process"
                },
                {
                  step: 2,
                  icon: Smartphone,
                  title: "Telegram Opens Bot",
                  description: "Redirect to ShillmongerBot"
                },
                {
                  step: 3,
                  icon: BadgeCheck,
                  title: "Press Start",
                  description: "Authorize the bot"
                },
                {
                  step: 4,
                  icon: CheckCircle2,
                  title: "Return Here",
                  description: "Connection happens automatically"
                }
              ].map((item) => (
                <Card 
                  key={item.step}
                  className="rounded-none bg-neutral-950 text-white border-2 border-black hover:shadow-none lg:shadow-none lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="px-4 py-4 sm:px-6 sm:py-4 text-center">
                    <div className="w-9 h-9 bg-[#229ED9]/10 border-2 border-[#229ED9]/30 flex items-center justify-center mx-auto mb-3">
                      <span className="text-sm font-black text-[#4FC3F7]">
                        {item.step}
                      </span>
                    </div>
                    <item.icon className="w-5 h-5 text-neutral-400 mx-auto mb-2.5" />
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white mb-1.5 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ====================================================
              SECTION 10: FOOTER
             ==================================================== */}
          <div className="text-center py-6 border-t-2 border-black">
            <p className="text-xs text-neutral-500 mb-2">
              Need help connecting Telegram?
            </p>
            <a
              href="#"
              className="text-sm font-black text-neutral-950 uppercase tracking-wider hover:text-[#229ED9] transition-colors inline-flex items-center gap-2"
            >
              Contact our support team
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}