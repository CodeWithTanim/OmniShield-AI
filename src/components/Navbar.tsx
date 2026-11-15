"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Users,
  Store,
  Factory,
  BarChart3,
  Volume2,
  Lock,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/citizen",
      label: "Citizen Shield",
      sublabel: "AI Voice & UPI Scams",
      icon: Users,
    },
    {
      href: "/shops",
      label: "Shop Armor",
      sublabel: "QR, Soundbox & Staff Alert",
      icon: Store,
    },
    {
      href: "/factory",
      label: "Factory & Code",
      sublabel: "IoT & Vulnerability Scanner",
      icon: Factory,
    },
    {
      href: "/dashboard",
      label: "Telemetry",
      sublabel: "Threat Feed & Database",
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060A18]/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#060A18]">
              <ShieldAlert className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
              <span>OmniShield</span>
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              People • Shops • Factories Protection
            </p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <div>
                  <div className="font-semibold leading-none">{item.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal mt-0.5">{item.sublabel}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Login */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Sign In</span>
            </Button>
          </Link>
          <Link href="/citizen">
            <Button size="sm" className="gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Emergency Scan</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#060A18] px-4 py-3 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-sm ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.sublabel}</div>
                </div>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <Link href="/auth/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/citizen" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs">
                Emergency Scan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
