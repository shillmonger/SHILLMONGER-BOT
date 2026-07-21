"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UserRightSidebar from "@/components/UserDashboard/UserRightSidebar";
import UserNav from "@/components/UserDashboard/UserNav";
import UserLeftSidebar from "@/components/UserDashboard/UserLeftSidebar";
import UserHeader from "@/components/UserDashboard/UserHeader";
import PromotionPopup from "@/components/UserDashboard/PromotionPopup";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [promotionOpen, setPromotionOpen] = useState(false);

  const pathname = usePathname();

  const hideRightSidebar =
    pathname === "/user-dashboard/" ||
    pathname === "/user-dashboard";

  useEffect(() => {
    const checkPromotion = () => {
      const lastShown = localStorage.getItem('lastPromotionShown');
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (!lastShown || (now - parseInt(lastShown)) > tenMinutes) {
        const timer = setTimeout(() => {
          setPromotionOpen(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    checkPromotion();

    const interval = setInterval(() => {
      const lastShown = localStorage.getItem('lastPromotionShown');
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (!lastShown || (now - parseInt(lastShown)) > tenMinutes) {
        setPromotionOpen(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleClosePromotion = () => {
    setPromotionOpen(false);
    localStorage.setItem('lastPromotionShown', Date.now().toString());
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile Header */}
      <UserHeader
        onLeftClick={() => setLeftSidebarOpen(true)}
        onRightClick={() => setRightSidebarOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex min-h-screen lg:h-screen">
        {/* Left Sidebar */}
        <UserLeftSidebar
          sidebarOpen={leftSidebarOpen}
          setSidebarOpen={setLeftSidebarOpen}
        />

        {/* Main Content */}
        <main
  className="
    flex-1
    min-w-0
    overflow-y-auto
    px-2
    pt-20
    pb-30
    lg:pt-10
    lg:px-4
    lg:pb-0
    lg:max-h-screen
    scrollbar-hide
  "
>
  {children}
</main>

        {/* Right Sidebar */}
        {!hideRightSidebar && (
          <UserRightSidebar
            sidebarOpen={rightSidebarOpen}
            setSidebarOpen={setRightSidebarOpen}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <UserNav />

      {/* Promotion Popup */}
      <PromotionPopup isOpen={promotionOpen} onClose={handleClosePromotion} />
    </div>
  );
}