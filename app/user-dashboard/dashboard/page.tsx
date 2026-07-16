"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, User, Mail, Calendar } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-sm text-neutral-600 uppercase tracking-widest font-semibold">
              XAUUSD BOT - Trading Platform
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-8">
                <h2 className="text-xl font-black uppercase tracking-tighter mb-6">
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">Username</p>
                      <p className="font-semibold">Your Username</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">Email</p>
                      <p className="font-semibold">your@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">Member Since</p>
                      <p className="font-semibold">July 2026</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-8">
                <h2 className="text-xl font-black uppercase tracking-tighter mb-6">
                  Account Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-900 border-2 border-neutral-800">
                    <span className="text-sm font-semibold">Email Verified</span>
                    <span className="text-xs font-black uppercase bg-white text-neutral-950 px-3 py-1">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-900 border-2 border-neutral-800">
                    <span className="text-sm font-semibold">Account Type</span>
                    <span className="text-xs font-black uppercase bg-white text-neutral-950 px-3 py-1">
                      Standard
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-900 border-2 border-neutral-800">
                    <span className="text-sm font-semibold">Trading Status</span>
                    <span className="text-xs font-black uppercase bg-white text-neutral-950 px-3 py-1">
                      Ready
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
              <CardContent className="p-8">
                <h2 className="text-xl font-black uppercase tracking-tighter mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="h-12 rounded-none text-xs font-black uppercase tracking-wider bg-white text-neutral-950 hover:bg-neutral-200 border-2 border-black"
                  >
                    Start Trading
                  </Button>
                  <Button
                    className="h-12 rounded-none text-xs font-black uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 border-2 border-neutral-800"
                  >
                    View History
                  </Button>
                  <Button
                    className="h-12 rounded-none text-xs font-black uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 border-2 border-neutral-800"
                  >
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logout Button */}
          <div className="mt-8">
            <Link href="/auth-page/login">
              <Button
                className="h-12 rounded-none text-xs font-black uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 border-2 border-black"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
