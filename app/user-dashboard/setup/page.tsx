"use client";

import { 
  UserPlus, 
  Server, 
  Copy, 
  Key, 
  Send, 
  CheckCircle, 
  ArrowRight,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="border-b-2 border-black pb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
            Setup Guide
          </p>
          <h1 className="text-2xl md:text-3xl font-mono font-black uppercase tracking-tighter text-neutral-950 mb-2">
            Connect Your MT5 Account
          </h1>
          <p className="text-neutral-600 text-sm">
            Register on Exness and connect your trading account in four steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">

          {/* Step 1 */}
          <div className="bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-10 h-10 bg-white text-neutral-950 font-black font-mono text-lg flex items-center justify-center flex-shrink-0 border-2 border-black">
                01
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Register on Exness
                </h2>
                <p className="text-neutral-400 text-xs mb-4">
                  Create your Exness account to get started with trading
                </p>
                <div className="space-y-3 bg-neutral-900/60 border border-neutral-800/80 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">
                      Go to{" "}
                      <a
                        href="https://www.exness.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        exness.com <ExternalLink className="w-3 h-3" />
                      </a>{" "}
                      and click &quot;Sign Up&quot;
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">
                      Fill in your email, create a password, and complete registration
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">
                      Verify your email through the link sent to your inbox
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="lex flex-col lg:flex-row items-start gap-4">
              <div className="w-10 h-10 bg-white text-neutral-950 font-black font-mono text-lg flex items-center justify-center flex-shrink-0 border-2 border-black">
                02
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Create Your Trading Account
                </h2>
                <p className="text-neutral-400 text-xs mb-4">
                  Choose Demo for practice, or Real for live trading
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Demo Account */}
                  <div className="bg-neutral-900/60 border border-neutral-800/80 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">
                      Demo — Recommended
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">Open Account → Demo Account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">Select MT5, choose leverage (e.g. 1:500)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">Set virtual balance (e.g. $10,000) and create</span>
                      </li>
                    </ul>
                  </div>

                  {/* Real Account */}
                  <div className="bg-neutral-900/60 border border-neutral-800/80 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                      Real — Live Trading
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">Complete identity verification (KYC) first</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">Open Account → Real → Standard or Pro</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">Deposit funds to start trading</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="lex flex-col lg:flex-row items-start gap-4">
              <div className="w-10 h-10 bg-white text-neutral-950 font-black font-mono text-lg flex items-center justify-center flex-shrink-0 border-2 border-black">
                03
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Copy Your Account Details
                </h2>
                <p className="text-neutral-400 text-xs mb-4">
                  Find these in your Exness account
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-neutral-900/60 border border-neutral-800/80 p-3">
                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                      <Send className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Telegram Username</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mb-2">Without the @ symbol</p>
                    <div className="bg-neutral-950 border border-neutral-800 px-2 py-1.5 font-mono text-xs text-neutral-300">
                      shillmonger_trades
                    </div>
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800/80 p-3">
                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">MT5 Login ID</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mb-2">Your 8-digit account number</p>
                    <div className="bg-neutral-950 border border-neutral-800 px-2 py-1.5 font-mono text-xs text-neutral-300">
                      84729402
                    </div>
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800/80 p-3 sm:col-span-2">
                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                      <Server className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Exness Server</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mb-2">Must match your account type</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-950 border border-neutral-800 px-2 py-1.5">
                        <p className="text-[9px] font-black uppercase text-emerald-400 mb-0.5">Demo</p>
                        <p className="font-mono text-xs text-neutral-300">Exness-MT5Trial9</p>
                      </div>
                      <div className="bg-neutral-950 border border-neutral-800 px-2 py-1.5">
                        <p className="text-[9px] font-black uppercase text-neutral-500 mb-0.5">Real</p>
                        <p className="font-mono text-xs text-neutral-300">Exness-MT5Real9</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800/80 p-3 sm:col-span-2">
                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                      <Key className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Trading Password</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mb-2">NOT your main Exness login password</p>
                    <div className="bg-neutral-950 border border-neutral-800 px-2 py-1.5 font-mono text-xs text-neutral-300">
                      Create one: Settings → Trading Password
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="lex flex-col lg:flex-row items-start gap-4">
              <div className="w-10 h-10 bg-white text-neutral-950 font-black font-mono text-lg flex items-center justify-center flex-shrink-0 border-2 border-black">
                04
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black uppercase tracking-tighter mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Submit to MT5 Connection
                </h2>
                <p className="text-neutral-400 text-xs mb-4">
                  Enter your details to complete the setup
                </p>
                <div className="space-y-3 bg-neutral-900/60 border border-neutral-800/80 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">
                      Go to the{" "}
                      <Link href="/user-dashboard/mt5-connection" className="text-emerald-400 hover:underline">
                        MT5 Connection page
                      </Link>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">Select your account type (Demo or Real)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">
                      Enter your Telegram username, Server, Login ID, and Trading Password
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-neutral-300">Click &quot;Connect Account&quot; to finish</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-black">
              <AlertCircle className="w-4 h-4 text-neutral-950" />
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950">
                Important Notes
              </h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-neutral-950 font-black">—</span>
                <span>Server name must match your account type (Trial for Demo, Real for Live)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-neutral-950 font-black">—</span>
                <span>Use your Trading Password, NOT your main Exness login password</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-neutral-950 font-black">—</span>
                <span>Keep your credentials secure and never share them with anyone</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-neutral-950 font-black">—</span>
                <span>Demo accounts are great for practice but have expiration dates</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-2">
            <Link
              href="/user-dashboard/mt5-connection"
              className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-black font-mono text-xs uppercase tracking-widest py-4 px-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
            >
              Go to MT5 Connection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}