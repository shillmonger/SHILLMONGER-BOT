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

  const hideRightSidebar =
    pathname === "/admin-dashboard/" ||
    pathname === "/admin-dashboard";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile Header */}
      <AdminHeader
        onLeftClick={() => setLeftSidebarOpen(true)}
        onRightClick={() => setRightSidebarOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex min-h-screen lg:h-screen">
        {/* Left Sidebar */}
        <AdminLeftSidebar
          sidebarOpen={leftSidebarOpen}
          setSidebarOpen={setLeftSidebarOpen}
        />

        {/* Main Content */}
        <main
  className="
    flex-1
    min-w-0
    overflow-y-auto
    px-4
    pt-15
    pb-30
    lg:pt-0
    lg:pb-0
    lg:max-h-screen
    scrollbar-hide
  "
>
  {children}
</main>

        {/* Right Sidebar */}
        {!hideRightSidebar && (
          <AdminRightSidebar
            sidebarOpen={rightSidebarOpen}
            setSidebarOpen={setRightSidebarOpen}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <AdminNav />
    </div>
  );
}
