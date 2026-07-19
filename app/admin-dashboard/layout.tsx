"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminRightSidebar from "@/components/AdminDashboard/AdminRightSidebar";
import AdminNav from "@/components/AdminDashboard/AdminNav";
import AdminLeftSidebar from "@/components/AdminDashboard/AdminLeftSidebar";
import AdminHeader from "@/components/AdminDashboard/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const pathname = usePathname();
  const hideRightSidebar = pathname === "/admin-dashboard/" || pathname === "/admin-dashboard/";

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header - Mobile only */}
      <AdminHeader
        onLeftClick={() => setLeftSidebarOpen(true)}
        onRightClick={() => setRightSidebarOpen(true)}
      />

      <div className="flex h-screen">
        {/* Sidebar - Desktop */}
        <AdminLeftSidebar sidebarOpen={leftSidebarOpen} setSidebarOpen={setLeftSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto px-4 py-5 pb-45 lg:pb-0 scrollbar-hide">
          {children}
        </main>

        {/* Right Sidebar - Desktop */}
        {!hideRightSidebar && (
          <AdminRightSidebar sidebarOpen={rightSidebarOpen} setSidebarOpen={setRightSidebarOpen} />
        )}
      </div>

      {/* Bottom Navigation - Mobile */}
      <AdminNav />
    </div>
  );
}
