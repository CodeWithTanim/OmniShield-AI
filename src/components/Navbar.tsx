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
  Menu,
  X,
  Sparkles,
  Trophy,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { JudgeLiveDemoModal } from "@/components/JudgeLiveDemoModal";
import { ScamCallSimulator } from "@/components/ScamCallSimulator";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [judgeModalOpen, setJudgeModalOpen] = useState(false);
  const [callSimOpen, setCallSimOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { href: "/citizen", label: "Citizen Shield", icon: Users },
    { href: "/shops", label: "Shop Armor", icon: Store },
    { href: "/factory", label: "Factory Guard", icon: Factory },
    { href: "/dashboard", label: "Telemetry", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060A18]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo - Minimal & Sleek */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#060A18]">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            OmniShield<span className="text-cyan-400">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Items - Clean single-line links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Login - Clean & Dynamic Session Aware */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => setJudgeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs font-bold hover:from-amber-500/30 hover:to-orange-500/30 shadow-md shadow-amber-500/10 transition-all active:scale-95"
            title="Open Judge Sandbox & Stage Presentation QR"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Judge Hub</span>
          </button>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#080D1B] px-2.5 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-200 max-w-[130px] truncate">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut().then(() => window.location.reload())}
                className="text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/20"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
          )}

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
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#060A18] px-4 py-3 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 text-cyan-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
            onClick={() => setJudgeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs font-bold hover:from-amber-500/30 hover:to-orange-500/30 shadow-md shadow-amber-500/10 transition-all active:scale-95"
            title="Open Judge Sandbox & Stage Presentation QR"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Judge Hub</span>
          </button>

          {session?.user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut().then(() => window.location.reload())}
                className="w-full text-xs text-rose-300 border-rose-500/30"
              >
                Sign Out ({session.user.name?.split(" ")[0] || "User"})
              </Button>
            ) : (
              <Link href="/auth/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/citizen" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs">
                Emergency Scan
              </Button>
            </Link>
          </div>
        </div>
      )}
      {/* Judge & Stage Live Sandbox Modal */}
      <JudgeLiveDemoModal
        isOpen={judgeModalOpen}
        onClose={() => setJudgeModalOpen(false)}
        onOpenCallSimulator={() => setCallSimOpen(true)}
      />

      {/* AI Scam Call Simulator Modal */}
      <ScamCallSimulator
        isOpen={callSimOpen}
        onClose={() => setCallSimOpen(false)}
      />
    </header>
  );
}
