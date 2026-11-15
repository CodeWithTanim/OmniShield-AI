"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Flame,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Send,
  PlusCircle,
  CheckCircle2,
  Users,
  Store,
  Factory,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThreatRadarItem, LIVE_THREAT_RADAR_DATA } from "@/data/liveThreatRadar";

export function LiveThreatRadar() {
  const [threats, setThreats] = useState<ThreatRadarItem[]>(LIVE_THREAT_RADAR_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Community Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportRegion, setReportRegion] = useState("Kolkata / West Bengal");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Auto-rotate ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % threats.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [threats.length]);

  const filteredThreats =
    selectedCategory === "ALL"
      ? threats
      : threats.filter((t) => t.category === selectedCategory);

  const currentItem = threats[currentIndex] || threats[0];

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc) return;

    try {
      await fetch("/api/threat-radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reportTitle,
          description: reportDesc,
          region: reportRegion,
          category: "CITIZEN_SCAM",
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportSubmitted(false);
        setShowReportModal(false);
        setReportTitle("");
        setReportDesc("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Ticker Bar */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-[#070B19] to-cyan-950/30 p-2.5 sm:p-3 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Left Ticker Tag */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <div className="flex items-center gap-1.5 font-black text-[11px] tracking-wider uppercase text-rose-300">
              <Radio className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              <span>South Asia Cyber Threat Radar</span>
            </div>
            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[9px] px-1.5 py-0">
              LIVE
            </Badge>
          </div>

          {/* Center Rotating News Headline */}
          <div className="flex-1 overflow-hidden min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-200 truncate">
              <span className="font-bold text-amber-300 shrink-0">
                [{currentItem.region}]:
              </span>
              <span className="truncate text-slate-100">{currentItem.title}</span>
              <span className="text-[10px] text-slate-400 shrink-0 hidden md:inline">
                ({currentItem.activeCount}+ reports • {currentItem.timestamp})
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowReportModal(true)}
              className="h-7 text-[11px] px-2.5 gap-1 border-slate-700 hover:border-cyan-500/40 text-cyan-300 hover:text-cyan-200"
            >
              <PlusCircle className="h-3 w-3" />
              <span>Report Scam</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="h-7 text-[11px] px-2 gap-1 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <span>{expanded ? "Hide Radar" : "View All"}</span>
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Live Threat Grid */}
      {expanded && (
        <Card className="border border-slate-800 bg-[#060A18]/95 shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="h-4 w-4 text-rose-400" />
                  <span>Real-Time Active Scam & Telemetry Surveillance Grid</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Surveilling scam call campaigns, malicious APK domains, and merchant payment spoofs spreading across South Asia.
                </CardDescription>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                {[
                  { label: "All Threats", val: "ALL" },
                  { label: "Citizens", val: "CITIZEN_SCAM" },
                  { label: "Merchants", val: "MERCHANT_FRAUD" },
                  { label: "Industrial", val: "INDUSTRIAL_SABOTAGE" },
                ].map((cat) => (
                  <button
                    key={cat.val}
                    type="button"
                    onClick={() => setSelectedCategory(cat.val)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      selectedCategory === cat.val
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-[#080D1B] text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredThreats.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-[#080D1B] p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <Badge
                      className={`text-[9px] font-bold ${
                        item.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {item.severity}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{item.region}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      <strong className="text-slate-300">Vector:</strong> {item.attackVector}
                    </p>
                    <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-2 text-emerald-300 text-[10px] leading-tight mt-1">
                      <strong className="text-emerald-200">Defense:</strong> {item.countermeasure}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#060A18] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldAlert className="h-4 w-4 text-cyan-400" />
                <span>Submit Emerging Scam to Regional Grid</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Threat Submitted Successfully</h4>
                <p className="text-xs text-slate-400">
                  OmniShield Neural Ingestion has queued your alert for cross-verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Threat Headline / Scam Type</label>
                  <Input
                    required
                    placeholder="e.g. New WhatsApp APK link claiming gas subsidy"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="bg-[#080D1B] border-slate-700 text-xs h-9"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Scam Link / Phone / Modus Operandi</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide scammer phone number, fake link, or SMS message details..."
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#080D1B] p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Target Region / City</label>
                  <Input
                    placeholder="e.g. Dhaka / Kolkata / Mumbai"
                    value={reportRegion}
                    onChange={(e) => setReportRegion(e.target.value)}
                    className="bg-[#080D1B] border-slate-700 text-xs h-9"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowReportModal(false)}
                    className="text-xs text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="cyber" className="text-xs gap-1.5">
                    <Send className="h-3 w-3" />
                    <span>Broadcast Threat</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
