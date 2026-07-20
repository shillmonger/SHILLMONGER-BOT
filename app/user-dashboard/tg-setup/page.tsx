"use client";

import { useState, useEffect } from "react";
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Bell, 
  MessageCircle, 
  BadgeCheck, 
  ArrowRight, 
  Lock, 
  CircleOff, 
  HelpCircle, 
  Smartphone, 
  Link2, 
  Bot,
  Star,
  Zap,
  Gift,
  ChevronDown,
  ChevronUp
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQ data
  const faqs = [
    {
      question: "Why do I need Telegram?",
      answer: "Telegram allows us to send you real-time notifications about your trading activity, subscription updates, and important account alerts instantly."
    },
    {
      question: "Can I disconnect later?",
      answer: "Yes, you can disconnect your Telegram account at any time from this page. Your data will remain secure and you can reconnect whenever you want."
    },
    {
      question: "Will I receive spam?",
      answer: "No. We only send important notifications related to your account, trading activity, and subscription. You can control notification preferences in your settings."
    },
    {
      question: "What happens after I press Start?",
      answer: "After pressing Start in Telegram, our bot will verify your account and automatically establish a secure connection. You'll be redirected back here with a success message."
    }
  ];

  // Feature cards data
  const features = [
    {
      icon: Star,
      title: "Subscription Updates",
      description: "Receive instant notifications about your subscription status and renewals"
    },
    {
      icon: Bell,
      title: "Trading Notifications",
      description: "Get real-time alerts for trading activity and market updates"
    },
    {
      icon: ShieldCheck,
      title: "Account Security",
      description: "Security alerts for login attempts and account changes"
    },
    {
      icon: Gift,
      title: "Withdrawal Notifications",
      description: "Instant confirmation when withdrawals are processed"
    },
    {
      icon: MessageCircle,
      title: "Customer Support",
      description: "Quick support updates and response notifications"
    },
    {
      icon: Zap,
      title: "Platform Announcements",
      description: "Be the first to know about new features and updates"
    }
  ];

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
      
      // Stop loading state since user will complete connection in Telegram
      setIsLoading(false);
      setSuccess(true);
      
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 font-sans">
      <main className="flex items-center justify-center py-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* ====================================================
              SECTION 1: HERO
             ==================================================== */}
          <div className="text-center space-y-4 py-8">
            <div className="w-20 h-20 bg-neutral-950 border-2 border-black flex items-center justify-center mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform duration-300">
              <Send className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-neutral-950">
              Connect Telegram
            </h1>
            <p className="text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Securely connect your Telegram account to receive important notifications and enable Telegram-powered features.
            </p>
          </div>

          {/* ====================================================
              SECTION 2: SUCCESS ALERT
             ==================================================== */}
          {success && (
            <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="text-sm font-black text-emerald-400 uppercase tracking-wider mb-1">
                  Telegram connected successfully
                </p>
                <p className="text-xs text-emerald-300">
                  You can now receive notifications from our platform.
                </p>
              </div>
            </div>
          )}

          {/* ====================================================
              SECTION 3: ERROR ALERT
             ==================================================== */}
          {error && (
            <div className="p-5 bg-red-500/10 border-2 border-red-500/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-black text-red-400 uppercase tracking-wider mb-1">
                  Connection Failed
                </p>
                <p className="text-xs text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ====================================================
              SECTION 4: CONNECTION STATUS CARD
             ==================================================== */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-1">
                    Connection Status
                  </h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Current Telegram Link Status
                  </p>
                </div>
                <div className={`px-4 py-2 border text-[11px] font-black uppercase tracking-widest ${
                  isConnected 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}>
                  {isConnected ? "Connected" : "Not Connected"}
                </div>
              </div>

              {!isConnected ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-neutral-900/60 border border-neutral-800">
                    <CircleOff className="w-8 h-8 text-red-400 flex-shrink-0" />
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
                    className="w-full px-8 py-4 bg-neutral-50 text-neutral-950 font-black text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:translate-x-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Connect Telegram
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {telegramData.username && (
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                          Username
                        </p>
                        <p className="text-base font-mono font-bold text-white">
                          {telegramData.username}
                        </p>
                      </div>
                    )}
                    {telegramData.telegramId && (
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                          Telegram ID
                        </p>
                        <p className="text-base font-mono font-bold text-white">
                          {telegramData.telegramId}
                        </p>
                      </div>
                    )}
                    {telegramData.connectedDate && (
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                          Connected Date
                        </p>
                        <p className="text-base font-mono font-bold text-white">
                          {telegramData.connectedDate}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleConnectTelegram}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-neutral-50 text-neutral-950 font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              SECTION 5: WHY CONNECT TELEGRAM
             ==================================================== */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-950 mb-6 text-center">
              Why Connect Telegram?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <CardContent className="px-6 py-6">
                    <div className="w-12 h-12 bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center mb-4 group-hover:border-neutral-600 transition-colors">
                      <feature.icon className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ====================================================
              SECTION 6: OFFICIAL BOT
             ==================================================== */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-8 py-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-2">
                    Official Telegram Bot
                  </h3>
                  <p className="text-2xl font-mono font-bold text-emerald-400 mb-2">
                    @ShillmongerBot
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                    Only connect using our official bot. We will never ask for your password or personal information.
                  </p>
                </div>
                <a
                  href="https://t.me/ShillmongerBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-neutral-50 text-neutral-950 font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <Smartphone className="w-4 h-4" />
                  Open Telegram
                </a>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================
              SECTION 7: HOW IT WORKS
             ==================================================== */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-950 mb-6 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="px-6 py-6 text-center">
                    <div className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center mx-auto mb-4">
                      <span className="text-sm font-black text-neutral-400">
                        {item.step}
                      </span>
                    </div>
                    <item.icon className="w-6 h-6 text-neutral-400 mx-auto mb-3" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">
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
              SECTION 8: SECURITY NOTICE
             ==================================================== */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-8 py-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-1">
                    Security Notice
                  </h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Your security is our priority
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Lock,
                    text: "We never ask for your Telegram password"
                  },
                  {
                    icon: MessageCircle,
                    text: "Only our official bot can message you"
                  },
                  {
                    icon: ArrowRight,
                    text: "You can disconnect your Telegram account anytime"
                  },
                  {
                    icon: ShieldCheck,
                    text: "Your Telegram chat ID is stored securely"
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-neutral-900/40 border border-neutral-800 hover:border-neutral-600 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ====================================================
              SECTION 9: FAQ ACCORDION
             ==================================================== */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-950 mb-6 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card 
                  key={index}
                  className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <CardContent className="px-6 py-4">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                        <span className="text-sm font-black uppercase tracking-wider text-white text-left">
                          {faq.question}
                        </span>
                      </div>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="mt-4 pt-4 border-t border-neutral-800 animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-xs text-neutral-400 leading-relaxed pl-8">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ====================================================
              SECTION 10: FOOTER
             ==================================================== */}
          <div className="text-center py-8 border-t-2 border-black">
            <p className="text-xs text-neutral-500 mb-2">
              Need help connecting Telegram?
            </p>
            <a
              href="#"
              className="text-sm font-black text-neutral-950 uppercase tracking-wider hover:text-neutral-700 transition-colors inline-flex items-center gap-2"
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
