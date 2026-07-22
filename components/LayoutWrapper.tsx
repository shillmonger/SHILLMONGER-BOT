"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/LandingPage/Header";
import Footer from "@/components/LandingPage/Footer";
import CookieConsent from "@/components/LandingPage/CookieConsent";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth-page");
  const isUserDashboard = pathname?.startsWith("/user-dashboard");
  const isAdminDashboard = pathname?.startsWith("/admin-dashboard");

  if (isAuthPage) {
    return (
      <>
        {children}
        <Footer />
      </>
    );
  }

  if (isUserDashboard || isAdminDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CookieConsent />
    </>
  );
}
