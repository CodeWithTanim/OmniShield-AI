"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Store,
  Factory,
  Volume2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Database,
  Cpu,
  Smartphone,
  PhoneCall,
  Activity,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceSpeakerButton } from "@/components/VoiceSpeakerButton";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* FULL VIEWPORT HERO SECTION */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center py-10 sm:py-14 border-b border-slate-800/80">
        {/* Glow ambient background aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-purple-500/25 blur-[140px] pointer-events-none -z-10" />

        <div className="w-full" /> {/* Top flex spacer */}

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center space-y-6 sm:space-y-7 my-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-xl shadow-cyan-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <ShieldAlert className="h-4 w-4 text-cyan-400" />
            <span>24/7 AI Cyber Defense for Citizens, Shops & Factories</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Protecting{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
              People, Shops & Factories
            </span>{" "}
            from Modern Scams.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Automated cyber safety without requiring an IT expert. Detects AI voice clones, fake UPI "Collect Money" debit traps, physical QR tampering, and secures factory IoT machines & AI-written software code.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/citizen">
              <Button size="lg" className="gap-2.5 h-12 px-6 text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105">
                <Users className="h-4 w-4" />
                <span>Launch Citizen Shield</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/shops">
              <Button size="lg" variant="secondary" className="gap-2.5 h-12 px-6 text-sm sm:text-base hover:bg-slate-800 transition-all hover:scale-105">
                <Store className="h-4 w-4 text-emerald-400" />
                <span>Explore Shop Armor</span>
              </Button>
            </Link>
            <Link href="/factory">
              <Button size="lg" variant="outline" className="gap-2.5 h-12 px-6 text-sm sm:text-base border-slate-700 hover:border-purple-400 hover:text-purple-300 transition-all hover:scale-105">
                <Factory className="h-4 w-4 text-purple-400" />
                <span>Factory & Code Guard</span>
              </Button>
            </Link>
          </div>

          {/* Quick Voice Demo Pill */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-slate-800/90 bg-[#080D1B]/90 px-4 py-2.5 shadow-lg backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Listen to Emergency Voice Alert (Hindi / Bengali / English):</span>
              <VoiceSpeakerButton
                text="सावधान! यह बटन आपके बैंक खाते से पैसे निकाल लेगा! पैसे प्राप्त करने के लिए कभी भी UPI पिन दर्ज न करें!"
                lang="hi"
                label="Play Sample Hindi Alert"
              />
            </div>
          </div>

          {/* Micro Trust Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-3 text-left">
            <div className="rounded-xl border border-slate-800/70 bg-[#060A16]/70 p-3">
              <div className="text-[11px] text-slate-400">Response Speed</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">Under 10 Seconds</div>
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-[#060A16]/70 p-3">
              <div className="text-[11px] text-slate-400">Spoken Voice</div>
              <div className="text-sm font-bold text-indigo-300 font-mono">Hindi • বাংলা • EN</div>
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-[#060A16]/70 p-3">
              <div className="text-[11px] text-slate-400">Helpline Aligned</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">1930 Integrated</div>
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-[#060A16]/70 p-3">
              <div className="text-[11px] text-slate-400">Data Privacy</div>
              <div className="text-sm font-bold text-purple-400 font-mono">Zero PIN Stored</div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="pt-6 pb-2 flex flex-col items-center justify-center gap-1 text-slate-500 text-[11px] animate-bounce">
          <span>Scroll to explore the 3 Shields</span>
          <ChevronDown className="h-4 w-4 text-cyan-400" />
        </div>
      </section>

      {/* THE 3 PROTECTION PILLARS */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider">
            Architecture Breakdown
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Three Specialized Shields for Three Real Worlds
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Designed to be used in 10 seconds by a busy chaiwala, a daily worker, or a factory supervisor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Pillar 1: Citizens */}
          <Card className="border-cyan-500/30 hover:border-cyan-400 transition-all hover:-translate-y-1">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 mb-2">
                <Users className="h-6 w-6" />
              </div>
              <Badge variant="default" className="w-fit text-[10px]">
                PILLAR 1: CITIZENS
              </Badge>
              <CardTitle className="text-lg">Citizen Scam Shield</CardTitle>
              <CardDescription>
                AI Voice Deepfake & UPI "Collect Money" debit trap defense for everyday families.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>AI Voice Clone Detection:</strong> Catches fake distress calls ("Papa, accident hua hai").</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>UPI Debit Trap Warning:</strong> Flashes red before entering PIN to receive funds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Audible Voice Alert:</strong> Speaks out loud in Hindi, Bengali, or English.</span>
                </li>
              </ul>
              <Link href="/citizen" className="block pt-2">
                <Button variant="cyber" size="sm" className="w-full justify-between text-xs">
                  <span>Open Citizen Shield</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pillar 2: Shops */}
          <Card className="border-emerald-500/30 hover:border-emerald-400 transition-all hover:-translate-y-1">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-2">
                <Store className="h-6 w-6" />
              </div>
              <Badge variant="success" className="w-fit text-[10px]">
                PILLAR 2: SHOPS & KAIWALA
              </Badge>
              <CardTitle className="text-lg">Shop Counter Armor</CardTitle>
              <CardDescription>
                Physical QR code integrity, fake soundbox fraud, and counter staff WhatsApp alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>QR Sticker Tampering:</strong> Verifies if counter standee was swapped with fake sticker.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>1-Click Staff WhatsApp Broadcast:</strong> Warns all employees in 5 seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Fake Payment Verifier:</strong> Validates 12-digit UTR against fake app screens.</span>
                </li>
              </ul>
              <Link href="/shops" className="block pt-2">
                <Button variant="emerald" size="sm" className="w-full justify-between text-xs">
                  <span>Open Shop Armor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pillar 3: Factories */}
          <Card className="border-purple-500/30 hover:border-purple-400 transition-all hover:-translate-y-1">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 mb-2">
                <Factory className="h-6 w-6" />
              </div>
              <Badge variant="warning" className="w-fit text-[10px]">
                PILLAR 3: FACTORIES & CODE
              </Badge>
              <CardTitle className="text-lg">Factory & Code Guard</CardTitle>
              <CardDescription>
                Automated vulnerability patching for AI-written code and IoT sensor sabotage protection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>AI Code Vulnerability Scanner:</strong> Catches hardcoded keys, SQLi, and eval() calls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>1-Click Auto-Remediation:</strong> Provides secure drop-in code fixes automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>Machine Kill-Switch:</strong> Isolates machines when temperature/vibration spikes.</span>
                </li>
              </ul>
              <Link href="/factory" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs border-purple-500/40 text-purple-300 hover:bg-purple-950/40">
                  <span>Open Factory Guard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* WHY OMNISHIELD TRUST & SAFETY SECTION */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="rounded-2xl border border-slate-800 bg-[#060A16] p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Why Everyday Bharat Relies on OmniShield AI</h3>
              <p className="text-xs text-slate-400 mt-1">
                Engineered for real street conditions: loud markets, slow mobile networks, and non-technical staff.
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span>Live Threat Telemetry</span>
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-4 pt-2">
            <div className="rounded-xl border border-slate-800/80 bg-[#080D1B] p-4 text-xs space-y-1.5">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <PhoneCall className="h-4 w-4" />
                <span>1930 Helpline Linked</span>
              </div>
              <p className="text-slate-400">Direct integration with the National Cybercrime Portal for immediate financial freezing.</p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-[#080D1B] p-4 text-xs space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" />
                <span>Works on 2G/3G/4G</span>
              </div>
              <p className="text-slate-400">Lightweight instant browser scan with zero heavy app downloads required.</p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-[#080D1B] p-4 text-xs space-y-1.5">
              <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4" />
                <span>Regional Spoken Voice</span>
              </div>
              <p className="text-slate-400">Audible emergency warnings in Hindi, Bengali, and English for busy counter staff.</p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-[#080D1B] p-4 text-xs space-y-1.5">
              <div className="font-bold text-purple-400 flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                <span>Zero PIN/Data Logging</span>
              </div>
              <p className="text-slate-400">Strict client-side privacy. Your UPI PIN and banking credentials are never saved.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
