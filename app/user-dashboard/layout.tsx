"use client";

import { useState } from "react";
import UserHeader from "@/components/UserDashboard/UserHeader";
import UserNav from "@/components/UserDashboard/UserNav";
import UserSidebar from "@/components/UserDashboard/UserSidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 md:ml-[280px] lg:ml-[320px] pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <UserNav />
    </div>
  );
}
