"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import UserRightSidebar from "@/components/UserDashboard/UserRightSidebar";
import UserNav from "@/components/UserDashboard/UserNav";
import UserLeftSidebar from "@/components/UserDashboard/UserLeftSidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const hideRightSidebar = pathname === "/user-dashboard/subscription" || pathname === "/user-dashboard/";

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <UserLeftSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 px-4 py-5 pb-30 lg:pb-0">
          {children}
        </main>

        {/* Right Sidebar - Desktop */}
        {!hideRightSidebar && <UserRightSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      </div>

      {/* Bottom Navigation - Mobile */}
      <UserNav />
    </div>
  );
}
