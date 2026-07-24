"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const desktopNavLinks = [
    { label: "Subscribtion", href: "/LandingPage/subscribtion" },
    { label: "API", href: "/api" },
    { label: "About Bot", href: "/about" },
    { label: "Community", href: "/community" },
  ];

  const mobileNavLinks = [
    { label: "About BOT", href: "/about" },
    { label: "Community", href: "/community" },
    { label: "Subscribtion", href: "/LandingPage/subscribtion" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Developers Portal", href: "/developers" },
    { label: "Guides & Tutorials", href: "/guides" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/60 shadow-sm py-2"
            : "bg-transparent py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Left: Logo & Brand Icon */}
          <Link href="/">
            <div className="flex items-center group cursor-pointer">
              <span className="font-bold tracking-tight text-2xl text-neutral-900">
                SHILLMONGER
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {desktopNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                    isActive ? "text-neutral-900 font-semibold" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Desktop Action Buttons / Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth-page/login">
                <button className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 px-4 py-2.5 transition-colors cursor-pointer">
                  Sign in
                </button>
              </Link>
              
              <Link href="/auth-page/register">
                <button className="rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#4338ca] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer">
                  Register
                </button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed right-0 top-0 h-full w-full bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-4">
            <span className="text-neutral-900 font-bold tracking-tight text-xl">
              SHILLMONGER
            </span>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links (Mobile) */}
          <nav className="flex flex-col space-y-1">
            {mobileNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center py-3 rounded-xl text-lg font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Action Buttons */}
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-neutral-100">
            <Link href="/auth-page/login" className="w-full">
              <button
                onClick={closeMobileMenu}
                className="w-full py-3 border border-neutral-200 text-neutral-800 font-semibold rounded-2xl text-base cursor-pointer hover:bg-neutral-50 transition-all"
              >
                Sign In
              </button>
            </Link>

            <Link href="/auth-page/register" className="w-full">
              <button
                onClick={closeMobileMenu}
                className="w-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white cursor-pointer py-3.5 font-semibold text-base rounded-2xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-95"
              >
                Register NOW
              </button>
            </Link>
            <p className="text-center text-[11px] text-neutral-400 mt-2 px-2">
              By joining, you agree to our Terms of Service and Risk Disclosure.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}