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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: "Subscribtion", href: "/LandingPage/subscribtion" },
    { label: "About", href: "/about" },
    { label: "Agents", href: "/agents" },
    { label: "Community", href: "/community" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-0 border-b ${
          isScrolled
            ? "bg-neutral-950 text-neutral-400 border-neutral-800 py-2"
            : "bg-neutral-950 text-neutral-400 border-neutral-800/30 py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between">
          {/* Left: Logo Placeholder */}
          <Link href="/">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="font-black tracking-widest text-xl text-neutral-50 uppercase">
              SHILLMONGER
            </span>
          </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest uppercase transition-colors relative py-2 group cursor-pointer ${
                    isActive ? "text-neutral-100" : "hover:text-neutral-300"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-neutral-100 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            })}
          </div>

          {/* Right: Desktop Action Buttons / Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop-only action */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth-page/register">
              <button className="relative bg-neutral-900 cursor-pointer text-neutral-50 text-xs font-bold uppercase tracking-widest px-6 py-3 overflow-hidden group border border-neutral-700 hover:bg-neutral-800 transition-colors duration-300 rounded-none">
                <span className="absolute inset-0 bg-neutral-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 group-hover:text-neutral-950 transition-colors duration-300">
                  Register NOW
                </span>
              </button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-100 hover:bg-neutral-900/50 transition-colors cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE SIDEBAR (100% Width) */}
      <aside
        className={`fixed right-0 top-0 h-full w-full bg-neutral-950 border-l border-neutral-800 shadow-2xl z-500 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-neutral-400 font-black tracking-widest text-xs uppercase">
              Menu
            </span>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-neutral-900 text-neutral-100 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links (Mobile) */}
          <nav className="flex flex-col">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`relative flex items-center py-4 text-xs font-black uppercase tracking-widest border-b border-neutral-800 cursor-pointer transition-colors ${
                    isActive ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth/Action Buttons */}
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-neutral-900">
            {/* Sign In Button */}
            <Link href="/auth-page//login">
            <button
              onClick={closeMobileMenu}
              className="w-full py-4 border border-neutral-800 text-neutral-400 font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-neutral-900 hover:text-white transition-all rounded-none"
            >
              Sign In
            </button>
            </Link>

            {/* Sign Up / Registration Action Button */}
            <Link href="/auth-page//register">
            <button
              onClick={closeMobileMenu}
              className="w-full justify-center items-center bg-white text-neutral-950 cursor-pointer px-8 py-4 font-black uppercase tracking-widest text-xs transition-all flex gap-3 shadow-lg hover:bg-neutral-200 hover:scale-[1.01] active:scale-95 rounded-none"
            >
              Register NOW
            </button>
            </Link>
            <p className="text-center text-[10px] text-neutral-500 mt-2 px-4 uppercase tracking-wider">
              By joining, you agree to our Terms of Service and Risk Disclosure.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}