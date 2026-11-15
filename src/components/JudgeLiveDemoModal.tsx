"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Smartphone,
  Sparkles,
  Trophy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  X,
  PhoneCall,
  Store,
  Factory,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JudgeLiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCallSimulator?: () => void;
}

export function JudgeLiveDemoModal({
  isOpen,
  onClose,
  onOpenCallSimulator,
}: JudgeLiveDemoModalProps) {
  const [appUrl, setAppUrl] = useState("http://localhost:3000");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppUrl(window.location.origin);
    }
  }, [isOpen]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&color=06b6d4&bgcolor=060A18&data=${encodeURIComponent(
    appUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/40 bg-[#060A18] p-5 sm:p-7 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-amber-500/20">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Judge &amp; Stage Demo Hub
                </h3>
                <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/40 text-[10px]">
                  Live Mobile Handoff
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Test OmniShield AI directly on your own smartphone during presentation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Dynamic QR Code Box */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-4 rounded-2xl border border-cyan-500/30 bg-[#040816] shadow-xl">
            <div className="relative p-2.5 rounded-2xl border border-cyan-500/40 bg-[#060A18] shadow-2xl">
              <img
                src={qrImageUrl}
                alt="Scan to open OmniShield on Phone"
                className="w-48 h-48 rounded-xl object-contain"
              />
              <span className="absolute -top-2 -right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 items-center justify-center text-[10px] text-black font-black">
                  ✓
                </span>
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
                <span>Scan with Camera</span>
              </div>
              <p className="text-[11px] text-slate-400">
                PWA opens instantly on iOS & Android. Zero download required.
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1.5 w-full">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full text-[11px] font-mono bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy URL"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Quick Stage Trigger Buttons & Pitch Highlights */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1-Click Stage Demo Scenarios:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCallSimulator?.();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-rose-300">
                        1. Trigger AI Distress / Digital Arrest Call
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Realistic incoming call with 4-second regional voice alert
                      </div>
                    </div>
                  </div>
                  <Zap className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
                </button>

                <a
                  href="/shops"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-cyan-300">
                        2. Test Merchant Armor &amp; Soundbox
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Camera QR scan, fake Paytm screenshot, soundbox alert
                      </div>
                    </div>
                  </div>
                  <Zap className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="/factory"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Factory className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-300">
                        3. Test Factory IoT Sabotage &amp; Kill-Switch
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Telemetry anomaly detection and 1-click safety patch
                      </div>
                    </div>
                  </div>
                  <Zap className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Judging Criteria Scorecard */}
            <div className="rounded-xl border border-slate-800 bg-[#080D1E] p-3 text-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Why OmniShield AI Stands Out:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>3-Sec Voice Synthesis Trap</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Spoken বাংলা &amp; हिंदी Alerts</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>1930 Cyber Helpline PDF</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Full Offline PWA Shell</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Engineered by Team VenoX for Hackathon Finals</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white"
          >
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );
}
