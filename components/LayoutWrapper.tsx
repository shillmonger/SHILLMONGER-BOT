"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/LandingPage/Header";
import Footer from "@/components/LandingPage/Footer";
import CookieConsent from "@/components/LandingPage/CookieConsent";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth-page");

  if (isAuthPage) {
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
