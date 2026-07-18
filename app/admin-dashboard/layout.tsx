"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminRightSidebar from "@/components/AdminDashboard/AdminRightSidebar";
import AdminNav from "@/components/AdminDashboard/AdminNav";
import AdminLeftSidebar from "@/components/AdminDashboard/AdminLeftSidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const hideRightSidebar = pathname === "/admin-dashboard/" || pathname === "/admin-dashboard/";

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <AdminLeftSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 px-4 py-5 pb-30 lg:pb-0">
          {children}
        </main>

        {/* Right Sidebar - Desktop */}
        {!hideRightSidebar && <AdminRightSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      </div>

      {/* Bottom Navigation - Mobile */}
      <AdminNav />
    </div>
  );
}
