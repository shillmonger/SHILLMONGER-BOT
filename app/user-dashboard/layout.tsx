"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import UserRightSidebar from "@/components/UserDashboard/UserRightSidebar";
import UserNav from "@/components/UserDashboard/UserNav";
import UserLeftSidebar from "@/components/UserDashboard/UserLeftSidebar";
import UserHeader from "@/components/UserDashboard/UserHeader";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const pathname = usePathname();
  const hideRightSidebar = pathname === "/user-dashboard/" || pathname === "/user-dashboard/";

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header - Mobile only */}
      <UserHeader
        onLeftClick={() => setLeftSidebarOpen(true)}
        onRightClick={() => setRightSidebarOpen(true)}
      />

      <div className="flex h-screen">
        {/* Sidebar - Desktop */}
        <UserLeftSidebar sidebarOpen={leftSidebarOpen} setSidebarOpen={setLeftSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto px-4 py-5 pb-45 lg:pb-0">
          {children}
        </main>

        {/* Right Sidebar - Desktop */}
        {!hideRightSidebar && (
          <UserRightSidebar sidebarOpen={rightSidebarOpen} setSidebarOpen={setRightSidebarOpen} />
        )}
      </div>

      {/* Bottom Navigation - Mobile */}
      <UserNav />
    </div>
  );
}